// Класс формы поиска
class SearchForm {
  constructor(formElement) {
    this.inputElement = formElement.querySelector(".search-form__input");
    this.searchModal = formElement.querySelector(".search-form__modal-wrapper");
    this.subject = formElement.querySelector(".search-form__subject"); // span строки поиска
    this.inputElement.addEventListener("search", (e) => {
      this.onInputSearch(e);
    });
  }

  onInputSearch(e) {
    
    
    if (!!e.target.value) {
      this.searchModal.classList.remove("search-form__modal-wrapper--hidden");

      this.subject.innerText = e.currentTarget.value;

      // Показ модального окна поиска с задержкой
      setTimeout(() => {
        this.searchModal.classList.add("search-form__modal-wrapper--hidden");
      }, 1500);
    }
  }
}

let searchForm = new SearchForm(document.querySelector(".search-form"));
;

// Класс для раскрывающегося дерева категорий
class TreeList {
  constructor(mainList) {
    mainList.addEventListener('click', (e) => this.onTreeItemClick(e))
  }

  onTreeItemClick(e) {
    const target = e.target.closest('li')
    const caret = target.querySelector('.caret')

    // Переворот каретки иконки переключением класса  
    if(!!caret) {
      caret.classList.toggle('caret--open')
    }
    if (!!target) {

    // Поиск вложенного в li ul
      const list = target.querySelector('.nested')
      if (!!list) {
        const listStyle = getComputedStyle(list)
        listStyle.display === 'none' ? list.style.display = 'block' : list.style.display = 'none'
      }
    }
  }
}


// Класс для свертывания / развертывания фильтров
class SortFilter {
  constructor(filter) {
    this.filter = filter;
    filter.addEventListener('click', (e) => this.onFilterClick(e))
  }

  onFilterClick(e) {
    const filterName = e.target  
    if (e.target.classList.contains('filters__name')) {
      filterName.parentNode.classList.toggle('filters__field--collapsed')
    }
  }
}




let tree = new TreeList(document.querySelector(".categories__list--main-list"));
let filters = new SortFilter(document.querySelector(".departments__filters"));
;
// Storage - класс для взаимодействия с LocalStorage

class Storage {
  constructor() {
    //Начальные данные для корзины
    this.initialStorage = [
      { id: 0, name: 'Vintage Typewriter', quantity: 1, price: '49.50' },
      { id: 1, name: 'Lee Pucker design', quantity: 2, price: '12.50' },
    ]
    this.storage = this.initialStorage
    this.setItems(this.storage)
  }

  //Запись в Local Storage
  setItems(storage) {
    localStorage.setItem('Shop storage', JSON.stringify(storage))
  }

  //Получение из Local Storage
  getItems() {
    return JSON.parse(localStorage.getItem('Shop storage'))
  }

  //Добавление элемента в хранилище
  addItem(item) {
    const existsIndex = this.getElementNameId(item.name, this.storage)
    // Если уже существует запись с таким именем, то у нее просто увеличивается счетчик quantity 
    if (existsIndex !== -1) {
      this.changeQuantity(existsIndex, 1)
    } else {
      //В качестве id берется длина массива записей
      let tmpItem = {name: item.name, price: item.price, quantity: 1, id:this.storage.length }
      this.storage = [...this.storage, tmpItem]
      this.setItems(this.storage)
    }
  }

  // Удаление элемента
  removeItem(id) {
    this.storage = this.storage.filter((i) => i.id !== id);
    // Обновление всех индексов id после удаления
    this.storage.forEach((item, i) =>  {
      item.id = i
    })
    this.setItems(this.storage)
  }

  // Вспомогательная функция поиска совпадений name в массиве объектов
  getElementNameId(name, arr) {
    let findIndex = -1
    arr.forEach((item, index) => {
      if (item.name === name) {
        findIndex = index
      }
    })
    return findIndex
  }

  // Изменение количества по указанному id  
  changeQuantity(id, quantityDelta) {
    this.storage[id].quantity += quantityDelta;

    // При уменьшении quantiy до 0 элемент удаляется
    if(this.storage[id].quantity <= 0) {
      this.removeItem(id)
    }
    this.setItems(this.storage)
  }
}


// Класс для управления корзиной и добавлением в неё товаров
class Basket {
  constructor(basket, goodsList) {
    this.storage = new Storage()

    this.basket = basket
    this.cardButton = basket.querySelector('.user__button--cart')
    this.modalWrapper = basket.querySelector('.user__basket-wrapper')
    this.modalWindow = basket.querySelector('.user__basket')
    this.basketList = basket.querySelector('.basket__list')
    this.basketTotalPrice = basket.querySelector('.basket__total-price')
    this.basketQuantity = basket.querySelector('.user__items-quantity')

    // Получение DOM объекта элемента списка товаров
    this.goodsList = goodsList


    this.setBasketQuantity(this.storage.getItems())


    this.cardButton.addEventListener('click', (e) => this.onCardButtonClick(e))
    this.modalWrapper.addEventListener('click', (e) => this.onModalClick(e))
    
    this.goodsList.addEventListener('click', (e) => this.onGoodsCardClick(e))
  }

  onCardButtonClick(e) {
    //Показать окно и вызвать render корзины
    this.modalWrapper.classList.remove("user__basket-wrapper--hidden")
    this.renderBasket()
  }

  // Установка иконки количества товаров в корзине, если они есть
  setBasketQuantity(storage) {
    let quantity = 0 
    if (storage.length > 0) {
      this.basketQuantity.classList.add('user__items-quantity--show')
      storage.forEach( item => quantity += item.quantity)
      this.basketQuantity.innerHTML = quantity 
    } else {
      this.basketQuantity.classList.remove('user__items-quantity--show')
    }
  }

  // Обработка кликов по модальному окну
  onModalClick(e) {
    const $target = e.target;
    if ($target.parentNode.closest('div') !== this.modalWindow) {
      this.modalWrapper.classList.add('user__basket-wrapper--hidden');
    } else {
      // Если был клик по кнопке, определяем, что за кнопка и выполняем действие
      if ($target.tagName === 'BUTTON') {
        const info = this.defineAction($target)
        this.performAction(info)
      }
    }
  }

  // Выполнения действия с указанным id и перерисовка
  performAction({ id, action }) {
    switch (action) {
      case 'REMOVE':
        this.storage.removeItem(+id)
        break;
      case 'INC':
        this.storage.changeQuantity(+id, -1)
        break;
      case 'DEC':
        this.storage.changeQuantity(+id, 1)
        break
      default:
        break
    }

    this.renderBasket();
  }

  // Определение типа кнопки
  defineAction($target) {
    let info = { id: undefined, action: undefined }

    info.id = $target.closest('li').dataset.id

    switch ($target.className) {
      case 'cart-item__button-close':
        info.action = 'REMOVE'
        break;
      case 'cart-item__quantity-button--inc':
        info.action = 'INC'
        break;
      case 'cart-item__quantity-button--dec':
        info.action = 'DEC'
        break

      default:
        break
    }
    return info
  }

  // Перерисовка корзины
  renderBasket() {
    let items = this.storage.getItems()
    this.setBasketQuantity(items)
    this.basketList.innerHTML = ''
    let totalPrice = 0

    if(items.length === 0) {
      let $el= document.createElement('li')
      $el.classList.add('cart-item__empty')
      $el.innerHTML = 'Cart is Empty!'
      this.basketList.append($el)
    } else {
      //Map по элементам массива и добавление в список, а так же подсчет общей суммы заказа
      this.renderElement(
        items.map((i) => {
          let $el = this.renderElement(i)
          totalPrice += i.price * i.quantity
          this.basketList.append($el)
        })
        )
      }
      

    this.basketTotalPrice.innerHTML = totalPrice.toFixed(2) + "$"
  }

  renderElement(data) {
    let $elem = document.createElement("li")
    $elem.classList.add("basket__cart-item", "cart-item")
    $elem.setAttribute("data-id", data.id)
    $elem.innerHTML = `
    <span class="cart-item__name">${data.name}</span>
                    <p class="cart-item__quantity--wrapper">                   
                      <button class="cart-item__quantity-button--inc">-</button>
                      <span class="cart-item__quantity">${data.quantity}</span>   
                      <button class="cart-item__quantity-button--dec">+</button>
                    </p>
                    <span class="cart-item__price">${data.price}$</span>
                    <button class="cart-item__button-close">x</button>
    `;
    return $elem;
  }

  // Обработка кликов по карточке товара
  onGoodsCardClick(e) {
    const card = e.target.closest('.card')
    if(!!card) {
     const {name, price} = this.defineCardParams(card)
     this.storage.addItem({name, price}) 
     this.renderBasket()
    }
  }

  // Вспомгательная функция определения цены и названия товара карточки
  defineCardParams(card) {
    const info = {}
    info.name = card.querySelector('.card__name-for-basket').innerHTML
    info.price = card.querySelector('.card__price').innerHTML.slice(1)
    return info
    
  }
}



const basket = new Basket(document.querySelector('.user'), document.querySelector('.cards__list'))
console.log(window.screen.width)
;