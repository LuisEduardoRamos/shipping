import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
Vue.use(Vuex);

const baseUrl = 'https://eshop-deve.herokuapp.com/api/v2/orders';
const headers = {headers:{Authorization: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkM2NIVUVibVJoc1EzeXhNbzV2VnliSTFzaDZCSDJZRCIsImlhdCI6MTU4NTkzMjYzNDU0OH0.tMSht_M3ryQl5IqCirhYR1gb8j3FQ26vILT4Qpx4XrdFz-zUmqbgFYiKTaZHPpB85etRIMhxVoZf6tOrHy0fnA'}};

export default new Vuex.Store({
    strict: true,
    state: {
        options: [],
        items: [],
        total: null
    },
    getters:{
        getOptions(state){
            return state.options;
        },
        getItems(state){
            return state.items;
        },
        getTotal(state){
            return state.total;
        }
    },
    mutations:{
        SET_ITEM(state, newValue){
            state.items.push(newValue);
        },
        SET_ITEMS(state, newValue){
            state.items = newValue;
        },
        SET_OPTIONS(state, newValue){
            state.options = newValue;
        }
    },
    actions:{
        initOptions({commit}){
            axios.get(baseUrl, headers)
            .then(response => {
                commit('SET_OPTIONS', response.data.orders)
            }).catch(err => {
                console.log(err);
            })
        },
        listItems({commit}, id){
            axios.get(`${baseUrl}/${id}`, headers)
            .then(response => {
                commit('SET_ITEMS', response.data.order.items);
            }).catch(err => {
                console.log(err);
            })
        },
        addItem({commit}, item){
            commit('SET_ITEM', item);
        }
    }
})