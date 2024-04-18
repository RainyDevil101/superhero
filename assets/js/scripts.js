// 3. Una vez ingresado el número del héroe a buscar y después de realizar un click sobre
// el botón de búsqueda, se debe capturar y validar la información para evitar búsquedas
// que contengan algún texto diferente a números y mostrar la información
// dinámicamente mediante la librería jQuery y CanvasJS con un gráfico de pastel. Para
// lograr todo esto se debe: (8 Puntos)
// 3.1 Capturar la información ingresada mediante eventos del DOM con jQuery. (1
// Punto)
// 3.2 Implementar funciones para separar la captura de la información ingresada
// por el usuario con la consulta a la API. (1 Punto)
// 3.3 Comprobar la información ingresada por el usuario, la cual, solo debe ser un
// número. (0.5 Puntos)
// 3.4 Consultar la API mediante AJAX con la sintaxis de jQuery. (1 Punto)
// 3.5 Renderizar la información recibida por la API dinámicamente utilizando
// tarjetas (card) de Bootstrap. (1 Punto)
// 3.6 Utilizar ciclos y métodos para arreglos u objetos que permitan recorrer, ordenar
// y mostrar la información. (1 Punto)
// 3.7 Emplear la librería de gráficos CanvasJS, para mostrar dinámicamente
// información específica de cada superhéroe. (2 Puntos)
// 3.8 Implementar estructuras condicionales para generar alertas cuando existan
// errores en la búsqueda. (0.5 Puntos)}

import { mockResponse } from '../mock/hero.js';

$(document).ready(function () {
  const API_KEY = '4905856019427443';
  const URL = 'https://superheroapi.com/api.php/';

  $('#search-superhero').superheroSearch(API_KEY, URL, false);
});

(function ($) {
  $.fn.superheroSearch = function (API_KEY, URL, useMock = true) {
    const $this = $(this);
    const modalId = $('#modal-loading-id');

    $this.on('click', function (event) {
      event.preventDefault();

      const superheroId = $('#superhero-id').val();

      $this
        .prop('disabled', true)
        .removeClass('bg-slate-900')
        .addClass('bg-slate-300 cursor-not-allowed');

      modalId.removeClass('hidden');

      if (superheroId === '') {
        alert('Ingrese un número de héroe');
        resetButtonAndModal();
        return;
      }

      if (isNaN(superheroId)) {
        alert('Ingrese un número de héroe válido');
        resetButtonAndModal();
        return;
      }

      if (useMock) {
        renderHero(mockResponse);
        resetButtonAndModal();
        return;
      }

      $.ajax({
        url: `${URL}${API_KEY}/${superheroId}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          $('#search-reset-id').removeClass('hidden');
          if (data.response === 'error') {
            alert('No se encontró un héroe con ese número');
            $('#search-reset-id').addClass('hidden');
            resetButtonAndModal();
            return;
          }
          resetButtonAndModal();
          renderHero(data);
        },
        error: function (error) {
          console.error('Error al realizar la llamada:', error);
          alert('Error al realizar la búsqueda');
          resetButtonAndModal();
          return;
        },
      });

      function resetButtonAndModal() {
        console.log(123);
        $this
          .prop('disabled', false)
          .addClass('bg-slate-900')
          .removeClass('bg-slate-300 cursor-not-allowed');
        modalId.addClass('hidden');
      }

      $('#search-reset-id').on('click', function () {
        // Ocultar el botón de reset
        $('#search-reset-id').addClass('hidden');

        // Mostrar el formulario de búsqueda
        $('#hero-form-id').removeClass('hidden');

        // Ocultar la tarjeta del héroe
        $('#hero-card-id').addClass('hidden');

        // Limpiar los campos del formulario
        $('#superhero-id').val('');

        // Mostrar el botón de búsqueda principal
        $('#search-superhero')
          .prop('disabled', false)
          .removeClass('bg-slate-300 cursor-not-allowed')
          .addClass('bg-slate-900');
      });
    });
  };
})(jQuery);

// Renderizar Hero

function renderHero(heroData) {
  console.log(heroData);

  // Esconder hero-form
  $('#hero-form-id').addClass('hidden');

  // Mostrar hero-card
  $('#hero-card-id').removeClass('hidden');

  // Datos
  $('#hero-image-id').attr('src', heroData.image.url);
  $('#hero-name-id').text(heroData.name);
  $('#group-affiliation-id').text(heroData.connections['group-affiliation']);
  $('#publisher-id').text(heroData.biography.publisher);
  $('#occupation-id').text(heroData.work.occupation);
  $('#first-appearance-id').text(heroData.biography['first-appearance']);
  $('#height-id').text(heroData.appearance.height[1]);
  $('#weight-id').text(heroData.appearance.weight[1]);
  $('#alliases-id').text(heroData.biography.aliases.join(', '));
  $('#hero-name-chart-id').text(heroData.name);

  if (heroData.powerstats.intelligence === 'null') {
    return;
  }

  $('#chart-hero-id').removeClass('hidden');

  renderChart(heroData.powerstats, heroData.name);
}

function renderChart(powerstats, heroName) {
  const options = {
    animationEnabled: true,
    title: {
      text: 'Estadísticas de poder para ' + heroName,
    },
    data: [
      {
        type: 'pie',
        startAngle: 240,
        yValueFormatString: '##0.00"%"',
        indexLabel: '{label} {y}',
        showInLegend: 'true',
        legendText: '{label}',
        dataPoints: [
          { y: parseInt(powerstats.intelligence), label: 'Intelligence' },
          { y: parseInt(powerstats.strength), label: 'Strength' },
          { y: parseInt(powerstats.speed), label: 'Speed' },
          { y: parseInt(powerstats.durability), label: 'Durability' },
          { y: parseInt(powerstats.power), label: 'Power' },
          { y: parseInt(powerstats.combat), label: 'Combat' },
        ],
      },
    ],
  };
  $('#chartContainer').CanvasJSChart(options);

  // Mostrar botón de reset
}
