
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
