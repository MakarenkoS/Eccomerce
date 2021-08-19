// Класс формы поиска 
class SearchForm {
  constructor(formElement) {
    this.inputElement = formElement.querySelector('.search-form__input')
    this.searchModal = formElement.querySelector('.search-form__modal-wrapper')
    this.subject = formElement.querySelector('.search-form__subject') // span строки поиска
    this.inputElement.addEventListener('search', (e)=> {
      this.onInputSearch(e)
    })
  }

  onInputSearch(e) {
    this.searchModal.classList.remove('search-form__modal-wrapper--hidden')
    
    this.subject.innerText = e.currentTarget.value

// Показ модального окна поиска с задержкой
    setTimeout( ()=> {
      this.searchModal.classList.add('search-form__modal-wrapper--hidden')
    }, 1500)
  }
}

let searchForm = new SearchForm(document.querySelector('.search-form'))