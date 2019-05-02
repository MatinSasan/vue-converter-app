import { key } from './config.js';

new Vue({
  el: '#app',
  components: {
    key
  },

  data: {
    currencies: {},
    amount: 0,
    from: '',
    to: '',
    result: 0,
    loading: false
  },

  mounted() {
    this.getCurrencies();
  },

  computed: {
    formattedCurrencies() {
      return Object.values(this.currencies);
    },

    calculatedResult() {
      return (Number(this.amount) * this.result).toFixed(3);
    },

    disabled() {
      return this.amount === 0 || !this.amount || this.loading;
    }
  },

  methods: {
    getCurrencies() {
      const currencies = localStorage.getItem('currencies');

      if (currencies) {
        this.currencies = JSON.parse(currencies);

        return;
      }

      axios
        .get(
          `https://free.currencyconverterapi.com/api/v6/currencies?apiKey=${key}`
        )
        .then(response => {
          this.currencies = response.data.results;
          localStorage.setItem(
            'currencies',
            JSON.stringify(response.data.results)
          );
        });
    },

    convertCurrency() {
      const keys = `${this.from}_${this.to}`;

      this.loading = true;

      axios
        .get(
          `https://free.currconv.com/api/v7/convert?q=${keys}&compact=ultra&apiKey=${key}`
        )
        .then(response => {
          this.loading = false;
          console.log(response);
          this.result = response.data[keys];
        });
    }
  },

  watch: {
    from() {
      this.result = 0;
    },
    to() {
      this.result = 0;
    }
  }
});
