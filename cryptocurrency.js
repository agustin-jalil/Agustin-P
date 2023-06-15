  document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Ctether%2Cethereum%2Clitecoin%2Ccardano%2Cdogecoin&vs_currencies=usd&include_24hr_change=true')
      .then(res => res.json())
      .then(json => {
        const container = document.querySelector('.crypto');
        const coins = Object.getOwnPropertyNames(json);

        for (let coin of coins) {
          const coinInfo = json[coin];
          const price = coinInfo.usd;
          const change = coinInfo.usd_24h_change.toFixed(5);

          container.innerHTML += `
            <div class="coin ${change < 0 ? 'falling' : 'rising'}">
              <div class="coin-logo">
                <img src="assets/images/${coin}.png">
              </div>
              <div class="coin-name">
                <h3>${coin}</h3>
                <span>/USD</span>
              </div>
              <div class="coin-price">
                <span class="price">$${price}</span>
                <span class="change">${change}</span>
              </div>
            </div>
          `;

          const cryptocurrencyData = {
            name: coin,
            price: price,
            change: change
          };
          fetch('/cryptocurrencies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': '<%= form_authenticity_token.to_s %>'
            },
            body: JSON.stringify(cryptocurrencyData)
          })
            .then(response => response.json())
            .then(data => {
              console.log(data); // Optional: Log the response data
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }

        // Add event listeners after coin divs are added to the DOM
        const coinDivs = document.querySelectorAll('.coin');
        coinDivs.forEach((coinDiv) => {
          coinDiv.addEventListener('click', () => {
            const coinName = coinDiv.querySelector('.coin-name h3').textContent;
            fetchChart(coinName);
          });
        });

        // Fetch and display chart data for the selected cryptocurrency
        const selectedCoin = coins[0]; // Change this to the desired coin symbol
        fetchChart(selectedCoin);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  function fetchChart(coinName) {
    fetch(`https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=7&interval=daily`)
      .then(response => response.json())
      .then(data => {
        const prices = data.prices.map(priceData => priceData[1]);
        const labels = data.prices.map(priceData => new Date(priceData[0]).toLocaleDateString('en-US'));

        chartOptions.series[0].data = prices;
        chartOptions.xaxis.categories = labels;

        const lineChartElement = document.querySelector('.chart-area');
        lineChartElement.innerHTML = ''; // Clear the previous chart if any

        const chart = new ApexCharts(lineChartElement, chartOptions);
        chart.render();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  const chartOptions = {
    chart: {
      type: 'area',
      height: 180,
      toolbar: { show: false }, // Hide chart toolbar
      zoom: { enabled: false }, // Disable chart zooming
    },
    colors: ['gold'], // Set chart color
    series: [{ name: 'Prices', data: [] }], // Set chart data
    dataLabels: { enabled: false }, // Hide chart data labels
    stroke: { width: 3, curve: 'smooth' }, // Set chart stroke properties
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [0, 90, 100], // Set chart fill gradient stops
      },
    },
    xaxis: {
      categories: [], // Set x-axis categories
      axisBorder: { show: false }, // Hide x-axis border
      labels: { style: { colors: 'gold', fontFamily: 'Helvetica' } }, // Set x-axis label properties
    },
    yaxis: { show: false }, // Hide y-axis
    grid: {
      borderColor: 'rgba(0, 0, 0, 0)', // Set grid border color
      padding: { top: -30, bottom: -8, left: 12, right: 12 }, // Set grid padding
    },
    tooltip: {
      enabled: true, // Enable chart tooltip
      y: { formatter: (value) => `$${value}` }, // Set y-axis tooltip label formatter
      style: { fontFamily: 'Poppins' }, // Set tooltip font family
    },
    markers: { show: false }, // Hide chart markers
  };


  // Create new ApexCharts instance with chart options
  const chart = new ApexCharts(document.querySelector('.chart-area'), chartOptions);
  chart.render();
