import Prism from 'prismjs';
import 'font-awesome/scss/font-awesome.scss'
import './css/style.scss';

document.getElementById('revealexpress').addEventListener('loaded', function(event) {

  Prism.highlightAll();

});
