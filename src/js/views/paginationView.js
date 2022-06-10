import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); // obliczam liczbę stron, poprzez podzielenie długości arraya z przepisami przez liczbę wyników na stronę. Rezultat jest zaokrąglany w górę dzięki Math.ceil

    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return 'page 1, others';
    }
    // Last Page
    if (this._data.page === numPages && numPages > 1) {
      return 'last page';
    }
    // Other page
    if (this._data.page < numPages) {
      return 'other page';
    }

    // Page 1, and there are no other pages
    return 'only 1 page';
  }
}

export default new PaginationView();
