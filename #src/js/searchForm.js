// Класс формы поиска
class SearchForm {
  constructor(formElement) {
    this.form = formElement
    this.inputElement = formElement.querySelector('.search-form__input')
    this.searchModal = formElement.querySelector('.search-form__modal-wrapper')
    this.subject = formElement.querySelector('.search-form__subject') // span строки поиска
    this.searchButton = formElement.querySelector(
      '.search-form__search-button'
    );

    this.searchButton.addEventListener('click', (e) => this.onSearchButtonClick(e));
    this.inputElement.addEventListener('search', () => this.startSearch());
  }

  onSearchButtonClick(e) {
   
    if(window.screen.width <= 768 && !this.form.classList.contains('_active')) {
      this.form.classList.add('_active')
    } else {
      this.startSearch()
    }
  }

  startSearch() {
    let searchText = this.inputElement.value;
    if (!!searchText) {
      const searchText = this.inputElement.value;
      this.searchModal.classList.remove('search-form__modal-wrapper--hidden');
      this.subject.innerText = searchText;

      // Показ модального окна поиска с задержкой
      setTimeout(() => {
        this.searchModal.classList.add('search-form__modal-wrapper--hidden');
      }, 1500);
    }
  }
}

let searchForm = new SearchForm(document.querySelector('.search-form'));
