  var eventBus = new Vue()

    Vue.component('product-review',{
      template: `
        <form class="review-form" @submit.prevent="onSubmit">
          <p class="error" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
          <p>
            <label for="name">Name: </label>
            <input id="name" v-model="name">
          </p>
          <p>
            <label for="review">Review: </label>
            <input id="review" v-model="review">
          </p>
          <div>
            <label for="rating">Rating: </label>
            <select id="rating" v-model.number="rating">
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </div>
          <p>
            <input type="submit" value="Submit">
          </p>

        </form>
      `,
      data(){
        return {
          name: null,
          rating: null,
          review: null,
          errors: []
        }
      },
      methods: {
        onSubmit(){
          if (this.name && this.review && this.rating){
            let productReview = {
              name: this.name,
              review: this.review,
              rating: this.rating
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
          } else {
            if (!this.name) this.errors.push("Name required")
            if (!this.review) this.errors.push("Review required")
            if (!this.rating) this.errors.push("Rating required")
          }
        }
      }
    })

    Vue.component('product',{
      props: {
        premium: {
          type: Boolean,
          required: true
        }
      },
      template: `<div class="product">
    <div class="product-image">
      <img width="20%" :src="image" />
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-show="onSale">On Sale!</p>

      <span v-if="inStock">In Stock</span>
      <span v-else :class="{'out-of-stock': !inStock}">Out of Stock!</span>

      <p>Shipping: {{ shipping }}</p>
    </div>
    <br />
    <div class="product-link">
      <a :href="link">Details</a>
      <ul>
      <li v-for="detail in details">{{ detail }}</li>
      </ul>
    </div>

    <h4>Available Color:</h4>
    <ul>
    <div v-for="(variant,index) in variants"
    :key="variant.variantId"
    class="color-box"
    :style="{backgroundColor: variant.variantColor}"
      @mouseover="updateProduct(index)">
    </div>
    </ul>
    <ul>
    <h4>Available Sizes:</h4>
    <li v-for="size in sizes">{{ size }}</li>
    </ul>
    <br />

    <button v-on:click="addCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>

    <button v-on:click="removeCart">Remove Cart</button>

    <product-tabs :reviews="reviews"></product-tabs>

      </div>`,
      data() {
          return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            link: '#socks-green',
            onSale: true,
            details: ["80% Cotton", "20% polyester","Gender-neutral"],
            variants: [
              {
                variantId: 2234,
                variantColor: 'green',
                variantImage: './assets/vmSocks-green.png',
                variantQuantity: 10,
              },
              {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: './assets/vmSocks-blue.png',
                variantQuantity: 0,
              }
            ],
            sizes: ["Big","Medium","Small"],
            reviews:[]
          }
        },
        methods: {
          addCart: function (){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
          },
          removeCart: function(){
            this.$emit('remove-from-cart')
          },
          updateProduct: function (index){
            this.selectedVariant = index
            //this.image = this.selectedVariant
          }
        }, //methods
        computed: {
          title: function(){
            return this.brand +' ' + this.product
          },
          image: function(){
            return this.variants[this.selectedVariant].variantImage
          },
          inStock: function(){
            return this.variants[this.selectedVariant].variantQuantity
          },
          shipping: function(){
            if (this.premium){
              return "Free"
            }
            return 2.99
          }
        }, //computed
        mounted(){
          eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
          })
        }
      })


    Vue.component('product-tabs', {
      props: {
        reviews: {
          type: Array,
          required: true
        }
      },
      template: `
        <div>
          <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
            <a href="#">{{ tab }}</a> |
          </span>

      <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review}}</p>
          </li>
        </ul>
      </div>

    <product-review v-show="selectedTab === 'Make a Review'"></product-review>

        </div>
      `,
      data(){
        return {
          tabs: ['Reviews', 'Make a review'],
          selectedTab: 'Review'
        }
      }
    })
    var app = new Vue({
      el: '#app',
      data: {
        premium: false,
        cart: [],
        },
      methods: {
        updateCart(id){
          this.cart.push(id)
        },
        removeCart(){
          if (this.cart.length)
            this.cart.pop()
        }
      }
      })
