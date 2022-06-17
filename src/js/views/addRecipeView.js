import View from './View.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); // muszę zacząć od słowa super, bo ta klasa jest childem i dopiero wtedy będę posiadał this keyworda
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // protected, bo ta metoda jest używana tylko w tej klasie
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // manualnie ustawiam this keyword wewnątrz toggleWindow funkcji na this keyword, który wskazuje na aktualny obiekt - AddRecipeView. Muszę tak zrobić, bo gdybym zostwił kod z funkcji toggleWindow w event handlerze, to słowo this wskazywałoby na element, którego ev listener dotyczy.
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // chcąc odczytać dane z forma, mógłbym przypisać wszystkie jego pola do zmiennych i pobrać ich value. Ale jest na to inny sposób. Mogę użyć 'formData', które jest nowoczesnym browser API. Do formData construktora podaję element, którym jest form, więc w moim przypadku jest to po prostu this. Jest tak dlatego, this w ev listenerze to element, który jest nasłuchiwany, czyli this._parentElement, a _parentElement to .upload, czyli właśnie form. Zwrócony zostaje obiekt, który mogę spreadować do arraya i dzięki temu skorzystać z pozyskanych informacji.
      const data = Object.fromEntries(dataArr); // metoda fromEntries bierze array z entriesami (czyli z arrayami, które mają wartości-pary typu nazwa i wartość) i robi z niego obiekt, który następnie można dalej łatwo przekazać
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
