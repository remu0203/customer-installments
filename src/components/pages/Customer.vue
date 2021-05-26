<template>
    <div class="profile-page">
        <div class="page-header header-filter" data-parallax="true" >
        <a href="https://www.smartcharts.net/" style="z-index: 1; margin: 0px 0px 50px 200px;"><img src="images/logo.png" alt="Smartchart Logo" ></a>
        </div>
        
        <div class="main main-raised" >
            <div class="profile-content">
                <div class="container" v-if="loading">
                    <br> 
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <br><br>
                </div>
                <div class="container" v-if="!loading">
                    <template v-if="!params.email">
                        <div class="row">
                            <div class="col-md-6 ml-auto mr-auto">
                                <br><br>
                                <b-input-group class="mt-3">
                                    <b-form-input :state="emailError ? false : true" autocomplete="off" placeholder="Enter your registered email" v-model="email"></b-form-input>
                                    <b-input-group-append style="margin-top: -5px !important;">
                                    <b-button variant="success" @click="verifyEmail()">Submit</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                                <b-alert show variant="danger" v-if="emailError">{{ emailError }}</b-alert>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="row" v-if="customerInstallments.customer">
                            <div class="col-md-6 ml-auto mr-auto">
                                <div class="profile">
                                    <div class="avatar">
                                        <img src="images/default_profile.jpg" alt="Circle Image" class="img-raised rounded-circle img-fluid">
                                    </div>
                                    <div class="name">
                                        <h3 class="title all-caps" style="font-family: Avenir, Helvetica, Arial, sans-serif;">{{ customerInstallments.customer.first_name }} {{ customerInstallments.customer.last_name }}</h3>
                                        <p>{{ customerInstallments.customer.email }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-if="customerInstallments.installment">
                            <br><hr>
                            <h4 class="all-caps" style="color: #8ac040;">Installment Payments</h4>
                            <br>

                            <div id="accordion">
                                <div class="card" v-for="(installment, index) in customerInstallments.installment" v-bind:key="index">
                                    <div class="card-header" :class="resolveHeaderClass(index)" :id="'installment-'+index" >
                                    <!-- <h5 class="mb-0"> -->
                                        <button class="btn btn-link" :class="index=='0' ? '':'collapsed'" data-toggle="collapse" :data-target="'#collapse-'+index" :aria-expanded="index=='0' ? true:false" :aria-controls="'collapse-'+index">
                                            <h5><b>{{ installment.addon_id }} ( {{ installment.price | toCurrency }} {{ installment.currency }} )</b></h5>
                                        </button>
                                    <!-- </h5> -->
                                    </div>

                                    <div :id="'collapse-'+index" class="collapse" :class="index=='0' ? 'show':''" :aria-labelledby="'installment-'+index" data-parent="#accordion">
                                        <div class="card-body">
                                        <ul class="list-group list-group-flush" style="text-align:left;">
                                                <li class="list-group-item"><b>Status:</b> {{ installment.debt_status }}</li>
                                                <li class="list-group-item"><b>Event ID:</b> {{ installment.event_id }}</li>
                                                <li class="list-group-item"><b>CB Invoice ID:</b> {{ installment.cb_invoice_id }}</li>
                                                <li class="list-group-item"><b>Product ID:</b> {{ installment.product_id }}</li>
                                                <li class="list-group-item"><b>Salesforce Sales ID:</b> {{ installment.sf_sales_id }}</li>
                                            </ul>

                                            <div class="row">
                                                <div class="col-md-2">
                                                    <!-- <b-button variant="outline-primary" v-model="grid">0</b-button> -->
                                                    <b-button variant="outline-primary" @click="toggleView()" :title="grid===true ? 'View data in LIST' : 'View data in GRID'">
                                                        <b-icon :icon="grid===true ? 'list-ul' : 'grid3x3-gap-fill'"></b-icon> {{ grid===true ? 'List' : 'Grid' }}
                                                    </b-button>
                                                    <br><br>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <template v-if="grid">
                                                    <div class="col-md-4" v-for="(schedule, key) in installment.installment_payment_schedules"  v-bind:key="key">
                                                        <div class="card mb-3" :class="resolveClass(schedule.status)">
                                                            <div class="card-header" style="margin-top: 11px;">
                                                                <h5><b class="all-caps">{{ schedule.status }}</b></h5>
                                                                <!-- <p>( {{ schedule.sf_payment_schedule_id }} )</p> -->
                                                            </div>
                                                            <div class="card-body">

                                                                <h5 class="card-title">{{ resolveCurrencySymbol(schedule.currency) }} {{ schedule.amount | toCurrency }}</h5>
                                                                <p class="card-text">Due date: <b>{{ schedule.due_date | moment("dddd, MMMM DD, YYYY") }}</b></p>
                                                                <p class="card-text">Payment ID: <b>{{ schedule.sf_payment_schedule_id }}</b></p>
                                                                <p class="card-text">Payment Name: <b>{{ schedule.sf_payment_schedule_name }}</b></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <div class="col-md-12" v-else>
                                                    <b-table hover :items="installment.installment_payment_schedules" :fields="fields" :tbody-tr-class="rowClass"></b-table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </template>
                        <!-- <template v-else>
                            <br>
                            {{ message }}
                        </template> -->
                    </template>
                    <br><br>
                </div>
            </div>
        </div>

        <!-- <b-modal ref="my-modal" hide-footer title="Using Component Methods">
            <div class="d-block text-center">
                <h3>Hello From My Modal!</h3>
            </div>
            <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
            <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button>
        </b-modal> -->
    </div>
</template>


<script>
import axios from 'axios';
import moment from 'moment'

export default {
    name: "Customer",
    data() {
        return {
            fields: [
                {
                    key: 'status',
                    sortable: true
                },
                {
                    key: 'due_date',
                    formatter: "formatDueDate",
                    sortable: true
                },
                {
                    key: 'amount',
                    formatter: "formatAmount",
                    sortable: true
                },
                {
                    key: 'currency',
                    sortable: false
                },
                {
                    key: 'sf_payment_schedule_id',
                    label: 'Payment ID',
                    sortable: true
                },
                {
                    key: 'sf_payment_schedule_name',
                    label: 'Payment Name',
                    sortable: true
                },
            ],
            loading: false,
            params: {
                hash: '',
                email: ''
            },
            email: '',
            customerInstallments: {},
            url: process.env.VUE_APP_API_ENDPOINT,
            message: 'Welcome!',
            emailError: '',
            grid: false
        }
        // t=%242y%2410%24qNN9AKIhKhZWPPL%2F0PPesun5Bx8eLkdC1mTu8YikDviqBi5FHIgOW&e=remremdummy%2Bf1%40gmail.com
        // $2y$10$qNN9AKIhKhZWPPL/0PPesun5Bx8eLkdC1mTu8YikDviqBi5FHIgOW
        // remremdummy+f1@gmail.com
    },
    created()
     {
        this.loading = true;
        let urlParams = new URLSearchParams(window.location.search);
        this.params.hash = urlParams.get('t');
        this.params.email = urlParams.get('e');
        console.log("hash",this.params.hash)
        console.log("email",this.params.email)
        this.loading = false;
        if (window.location.href.indexOf("customer-page") > -1) {
            if(this.params.email){
            //     this.$refs['my-modal'].show();
            //     console.log("no email")
            // }else{
                this.fetchCustomerDetails();
            }
        }
     },
     methods:
     {
        fetchCustomerDetails(){
            this.loading = true;
            axios.post(this.url, 
                { email: this.params.email },
                { headers: {'x-api-key': this.params.hash, Authorization: "x-api-key", crossdomain: true, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization'} }
            )
            .then( response => {
                console.log("response",response);
                if(Object.prototype.hasOwnProperty.call(response.data, 'message')) {
                    this.params.email = '';
                    this.message = response.data.message;
                    this.emailError = response.data.message;
                }else{
                    this.customerInstallments = response.data;
                }
                this.loading = false;
            })
            .catch((error) => {
                console.log("error",error);
                this.message = 'No Data Found.';
                this.emailError = 'No Data Found.';
                this.customerInstallments = {};
                this.params.email = '';
                this.loading = false;
            });
            this.loading = false;
        },
        resolveCurrencySymbol(currency){
            if(currency=='PHP'){
                return '₱';
            }
            return '$';
        },
        resolveClass(status){
            if(status=='Pending'){
                return 'bg-warning';
            }
            if(status=='Paid'){
                return 'bg-success';
            }
            return 'bg-light';
        },
        resolveHeaderClass(index){
            index = Number(index);
            if(index%2==0){
                return 'bg-success';
            }
            return 'bg-warning';
        },
        rowClass(item, type) {
            if (!item || type !== 'row') return
            if (item.status === 'Pending') return 'table-danger'
        },
        formatDueDate(value) {
            return moment(value, 'YYYY-MM-DD').format('dddd, MMMM DD, YYYY');
        },
        formatAmount(value){
            if(value==''||value==null||value==undefined){
                value = 0;
            }
            let n = Number(value).toFixed(2);
            return Number(n).toLocaleString();
        },
        toggleView(){
            this.grid = !this.grid;
        },
        // showModal() {
        //     this.$refs['my-modal'].show()
        // },
        // hideModal() {
        //     this.$refs['my-modal'].hide()
        // },
        // toggleModal() {
        //     // We pass the ID of the button that we want to return focus to
        //     // when the modal has hidden
        //     this.$refs['my-modal'].toggle('#toggle-btn')
        // },
        verifyEmail(){
            this.params.email = this.email;
            this.fetchCustomerDetails();
        }
     }
}
</script>

<style scoped>
.bg-warning{
    background-color: #f8eb93!important;
}

.bg-info{
    background-color: #78d6e5!important;
}

.bg-success{
    background-color: #78e5a4!important;
}

.card .card-header{
    padding: 0px;
}

.btn-link{
    text-decoration: none !important;
    color: black !important;
}
.btn-link > h5 > b:hover {
  color: rgb(44, 160, 206) !important;
}

.btn{
    text-transform: none !important;
}
.btn-success{
    color: #fff;
    background-color: #198754;
    border-color: #198754;
}
</style>