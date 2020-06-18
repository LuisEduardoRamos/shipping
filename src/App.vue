<template>
  <div id="app">
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand>Órdenes</b-navbar-brand>
    </b-navbar> 
    <b-container id="main_container" fluid>
      <b-row cols="8">
        <b-col cols="1.5">
            <h4>No. Órden: </h4>
        </b-col>
        <b-col cols="2">
          <b-form-select v-model="selected" :options="options"></b-form-select>
        </b-col>
        <b-col cols=".5">
          <b-button @click="search" variant="primary" :disabled="selected == null">Buscar</b-button>
        </b-col>
        <b-col cols="1">
          <b-button @click="modalShow = !modalShow" variant="success" :disabled="selected == null || items.length === 0">Agregar</b-button>
        </b-col>
      </b-row>
      <b-row style="margin-top:10px;">
        <b-col>
          <b-table hover bordered borderless head-variant="light" :items="items" :fields="fields">
            <template v-slot:cell(sku)="data">
             {{data.item.sku|| "-"}}
            </template>
            <template v-slot:cell(price)="data">
             {{data.item.price | currency}}
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
           <b-button variant="primary" :disabled="items.length === 0">Pagar {{total||0|currency}}</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-modal 
      ref="item-form" 
      v-model="modalShow"
      @hidden="cleanModal" 
      hide-footer
      title="Agregar producto">
      <form ref="form" @submit.stop.prevent="addProduct">
        <b-form-group
          label="SKU"
          label-for="sku-input"
          invalid-feedback="El SKU es requerido"
        >
          <b-form-input
            id="sku-input"
            v-model="currentProduct.sku"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Nombre"
          label-for="name-input"
          invalid-feedback="El nombre es requerido"
        >
          <b-form-input
            id="name-input"
            v-model="currentProduct.name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Cantidad"
          label-for="quantity-input"
          invalid-feedback="La cantidad es requerido"
        >
          <b-form-input
            id="quantity-input"
            type='number'
            v-model="currentProduct.quantity"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Precio"
          label-for="price-input"
          invalid-feedback="El precio es requerido"
        >
          <b-form-input
            id="price-input"
            type='number'
            v-model="currentProduct.price"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">Guardar</b-button>
      </form>
    </b-modal>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
  },
  data(){
    return {
        selected: null,
        fields: [
          {
            key: 'sku',
            label: 'SKU',
            sortable: true
          },
          {
            key: 'name',
            label: 'Nombre',
            sortable: true
          },
          {
            key: 'quantity',
            label: 'Cantidad',
            sortable: true,
          },
          {
            key: 'price',
            label: 'Precio',
            sortable: true,
          }
        ],
        modalShow: false,
        currentProduct: {},
        total:0
      }
  },
  mounted() {
    this.initOptions();
  },
  computed: {
    ...mapGetters(['getOptions', 'getItems']),
    options: function() {
      return this.getOptions.map((option) => ({ 
        value: option.id, 
        text: option.id 
      }))
    },
    items: function() {
      return this.getItems;
    },
  },
  methods: {
    ...mapActions(['initOptions', 'listItems', 'addItem']),
    ...mapGetters(['getItems']),
    async search(){
      this.listItems(this.selected);
      this.sumTotal();
    },
    cleanModal(){this.currentProduct = {}},
    addProduct(){
      this.addItem(this.currentProduct);
      this.cleanModal();    
      this.sumTotal();
    },
    sumTotal(){
      let priceArray = this.getItems.map(item=>item.price);
      console.log(this.priceArray)
      let x = 0;
      for (let i = 0; i < priceArray.length; i++) {
        x+= priceArray[i];
      }
      this.total = x;
    }
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat("en-US",
      { style: "currency", currency: "USD" }).format(value);
    }
  }
}
</script>

<style>
  #main_container{
    padding: 20px;
  }
</style>
