class MobileMenu {
  constructor(navigation) {
    this.navigationMenu = navigation;
    this.menuButton = navigation.querySelector(".nav__menu-button");
    this.searchForm = navigation.querySelector(".search-form");

    this.menuButton.addEventListener("click", () => this.toggleMenu());
    // this.searchButton.addEventListener('click', () => this.activateSearch())
    this.navigationMenu.addEventListener("click", (e) => this.hideSearch(e));
  }

  toggleMenu() {
    this.navigationMenu.classList.toggle("_open");
    this.searchForm.classList.remove("_active");
  }

  activateSearch() {
    // this.searchForm.classList.toggle('_active')
  }

  hideSearch(e) {
    const $targetClassName = e.target.className;
    if (
      !!this.searchForm.classList.contains("_active") &&
      $targetClassName !== "search-form__input" &&
      $targetClassName !== "search-form__search-button--text" &&
      $targetClassName !== "search-form__search-button"
    ) {
      this.searchForm.classList.remove("_active");
    }
  }
}

const mobileMenu = new MobileMenu(document.querySelector(".nav"));
