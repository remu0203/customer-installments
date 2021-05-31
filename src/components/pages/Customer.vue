<template>
    <div class="profile-page">
        <div class="page-header header-filter" data-parallax="true" >
        <a href="https://www.smartcharts.net/" style="z-index: 1; margin: 0 auto;"><img src="images/logo.png" alt="Smartchart Logo" ></a>
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
                        <div class="row" v-if="params.hash">
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
                        <div class="row" v-else>
                            <div class="col-md-6 ml-auto mr-auto">
                                <br><br>Welcome!
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="row" v-if="customerInstallments.customer">
                            <div class="col-md-6 ml-auto mr-auto">
                                <div class="profile">
                                    <div class="avatar">
                                        <!-- <img src="images/default_profile.jpg" alt="Circle Image" class="img-raised rounded-circle img-fluid"> -->
                                        <br><br><br><br>
                                    </div>
                                    <div class="name">
                                        <h3 class="title all-caps" style="font-family: Avenir, Helvetica, Arial, sans-serif; color: black;">
                                            Installment Payments</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-if="customerInstallments.installment">

                            <b-list-group horizontal="md">
                                <b-list-group-item class="bg-primary">Name:</b-list-group-item>
                                <b-list-group-item>{{ customerInstallments.customer.first_name }} {{ customerInstallments.customer.last_name }}</b-list-group-item>
                            </b-list-group>
                            <b-list-group horizontal="md">
                                <b-list-group-item  class="bg-primary">Email:</b-list-group-item>
                                <b-list-group-item>{{ customerInstallments.customer.email }}</b-list-group-item>
                            </b-list-group>

                            <div id="accordion">
                                <div class="card" v-for="(installment, index) in customerInstallments.installment" v-bind:key="index">
                                    <div class="card-header" style="padding: 15px;" :class="resolveHeaderClass(index)" :id="'installment-'+index" >
                                        <span class="float-left mlink" :class="index=='0' ? '':'collapsed'" data-toggle="collapse" :data-target="'#collapse-'+index" :aria-expanded="index=='0' ? true:false" :aria-controls="'collapse-'+index" title="Toggle">
                                            <h5><b-icon icon="chevron-double-down" aria-hidden="true"></b-icon></h5>
                                        </span>
                                    <!-- <h5 class="mb-0"> -->
                                        <span class="mlink" :class="index=='0' ? '':'collapsed'" data-toggle="collapse" :data-target="'#collapse-'+index" :aria-expanded="index=='0' ? true:false" :aria-controls="'collapse-'+index">
                                            <h5><b>{{ installment.addon_name }}</b></h5>
                                        </span>
                                    <!-- </h5> -->
                                    </div>

                                    <div :id="'collapse-'+index" class="collapse" :class="index=='0' ? 'show':''" :aria-labelledby="'installment-'+index" data-parent="#accordion">
                                        <div class="card-body">
                                        <ul class="list-group list-group-flush" style="text-align:left;">
                                            <li class="list-group-item"><b>Course:</b> {{ installment.addon_name }}</li>
                                            <li class="list-group-item"><b>Status:</b> {{ installment.debt_status }}</li>
                                            <li class="list-group-item"><b>Event:</b> {{ installment.event_name }}</li>
                                            <li class="list-group-item"><b>Price Amount:</b> <span>{{ installment.price | toCurrency }} {{ installment.currency }}</span></li>
                                            <li class="list-group-item"><b>Balance Amount:</b> <span style="color:red;">{{ installment.balance | toCurrency }} {{ installment.currency }}</span></li>
                                        </ul>

                                            <div class="row">
                                                <div class="col-md-2">
                                                    <!-- <b-button variant="outline-primary" v-model="grid">0</b-button> -->
                                                    <b-button variant="outline-primary" @click="toggleView()" :title="grid===true ? 'View data in LIST' : 'View data in GRID'">
                                                        <b-icon :icon="grid===true ? 'list-ul' : 'grid3x3-gap-fill'"></b-icon> {{ grid===true ? 'List' : 'Grid' }}
                                                    </b-button>
                                                    <br><br>
                                                </div>
                                                <div class="col-md-10">
                                                    <b class="pull-left" style="padding-top: 14px; color: #1f467a;">SmartCharts Payment Schedule</b>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <template v-if="grid">
                                                    <!-- GRID VIEW -->
                                                    <div class="col-md-4" v-for="(schedule, key) in installment.installment_payment_schedules"  v-bind:key="key">
                                                        <div class="card mb-3" :class="resolveClass(schedule)">
                                                            <div class="card-header" style="margin-top: 11px;">
                                                                <!-- <h5><b class="all-caps" @click.prevent="showModal(key)">
                                                                    {{ schedule.status }}
                                                                </b></h5> -->
                                                                <h5 class="mlink all-caps" title="View transactions" @click="showModal(index, key)"><b>{{ schedule.status }}</b></h5>
                                                            </div>
                                                            <div class="card-body">
                                                                <h5 class="card-title">{{ resolveCurrencySymbol(schedule.currency) }} {{ schedule.amount | toCurrency }}</h5>
                                                                <p class="card-text">Due date: <b>{{ schedule.due_date | moment("dddd, MMMM DD, YYYY") }}</b></p>
                                                                <p class="card-text">Payment Method: <b class="all-caps">{{ schedule.payment_method ? schedule.payment_method : 'N/A' }}</b></p>
                                                                <!-- <p class="card-text">Payment Name: <b>{{ schedule.sf_payment_schedule_name }}</b></p> -->
                                                                <p class="card-text">Amount paid: <b>{{ resolveCurrencySymbol(schedule.currency) }} {{ schedule.amount_paid | toCurrency }}</b></p>
                                                                <p class="card-text">
                                                                    <b-button variant="light" size="sm" class="mt-3" block @click="showModal(index, key)">View Transactions</b-button>
                                                                    <b></b>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <div class="col-md-12" v-else>
                                                    <!-- LIST VIEW -->
                                                    <b-table responsive hover :items="installment.installment_payment_schedules" :fields="fields" :tbody-tr-class="rowClass" >
                                                        <template #cell(status)="data">
                                                            <!-- `data.value` is the value after formatted by the Formatter -->
                                                            <p title="View Transactions" class="vlink" @click="showModal(index, data.index)">{{ data.item.status }}</p>
                                                        </template>
                                                        <template #cell(payment_method)="data">
                                                            <p class="all-caps">{{ data.item.payment_method ? data.item.payment_method : 'N/A' }}</p>
                                                        </template>
                                                        <template #cell(amount)="data">
                                                            <p class="all-caps pull-right">{{ resolveCurrencySymbol(data.item.currency) }} {{ data.item.amount | toCurrency }}</p>
                                                        </template>
                                                        <template #cell(amount_paid)="data">
                                                            <p class="all-caps pull-right">{{ resolveCurrencySymbol(data.item.currency) }} {{ data.item.amount_paid | toCurrency }}</p>
                                                        </template>
                                                        <template #cell(action)="data">
                                                                <b-button variant="primary" size="sm"  @click="showModal(index, data.index)" title="View Transactions">
                                                                    <!-- <b-icon icon="view-list"></b-icon> -->
                                                                    View
                                                                </b-button>
                                                        </template>
                                                    </b-table>
                                                </div>
                                                <div>
                                                    <b-modal id="modal-trans" size="lg" hide-footer>
                                                        <template #modal-title>
                                                            <!-- <code>{{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].sf_payment_schedule_name }}</code> -->
                                                            <b-badge :variant="customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].status == 'Paid' ? 'success':'danger'" class="all-caps">{{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].status }}</b-badge>
                                                        </template>
                                                        <div class="d-block text-center" v-if="customerInstallments">
                                                            <!-- <h3>Hello From This Modal! {{modalIndexes}}</h3> -->
                                                            <p style="text-align:left;">Amount Due: <b>{{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].amount | toCurrency }} {{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].currency }}</b></p>
                                                            <p style="text-align:left;">Amount Paid: <b>{{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].amount_paid | toCurrency }} {{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].currency }}</b></p>
                                                            <p style="text-align:left;">Due date: <b>{{ customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].due_date | moment("dddd, MMMM DD, YYYY") }}</b></p>
                                                            <hr>
                                                            <p><b>Transactions</b></p>
                                                            <template v-if="hasTransactions()">
                                                                <b-table responsive hover :items="customerInstallments.installment[modalIndexes.i].installment_payment_schedules[modalIndexes.ips].installment_payment_transactions" :fields="modalFields" :tbody-tr-class="rowClass">
                                                                    <template #cell(status)="data">
                                                                        <p class="all-caps">{{ data.item.status }}</p>
                                                                    </template>
                                                                    <template #cell(amount)="data">
                                                                        <p>{{ resolveCurrencySymbol(data.item.currency) }} {{ data.item.amount | toCurrency }}</p>
                                                                    </template>
                                                                    <template #cell(created_at)="data">
                                                                        <p>{{ data.item.created_at | moment(" MMMM DD, YYYY hh:mm A") }}</p>
                                                                    </template>
                                                                </b-table>
                                                            </template>
                                                            <template v-else>
                                                                <b-alert show variant="danger">No Data Found.</b-alert>
                                                            </template>
                                                        </div>
                                                        <b-button variant="default" class="mt-3" block @click="$bvModal.hide('modal-trans')">Close</b-button>
                                                    </b-modal>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </template>
                        <div v-else>
                            <br> 
                            <div class="text-center">
                                <b-spinner label="Spinning">Loading ...</b-spinner>
                            </div>
                            <br>
                        </div>
                    </template>
                    <br><br>
                </div>
            </div>
        </div>
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
                    key: 'due_date',
                    formatter: "formatDate",
                    sortable: true
                },
                {
                    key: 'amount',
                    // formatter: "formatAmount",
                    label: 'Amount Due',
                    sortable: true
                },
                {
                    key: 'payment_method',
                    sortable: true
                },
                {
                    key: 'amount_paid',
                    // formatter: "formatAmount",
                    label: 'Amount Paid',
                    sortable: true
                },
                {
                    key: 'status',
                    sortable: true,
                    formatter: value => {
                        return value.toUpperCase()
                    }
                },
                // {
                //     key: 'currency',
                //     sortable: false
                // },
                // {
                //     key: 'sf_payment_schedule_id',
                //     label: 'Payment ID',
                //     sortable: true
                // },
                {
                    key: 'action',
                    dataClass: 'text-right'
                }
            ],
            modalFields: [
                {
                    key: 'status',
                    sortable: true
                },
                {
                    key: 'amount',
                    formatter: "formatAmount",
                    sortable: true
                },
                {
                    key: 'transaction_id',
                    sortable: true
                },
                {
                    key: 'created_at',
                    label: 'Date Time',
                    formatter: "formatDateTime",
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
            emailError: '',
            grid: false,
            modalIndexes: {
                i: 0,
                ips: 0
            },
            modalLoading: true
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
        // this.params.email = urlParams.get('e');
        console.log("hash",this.params.hash)
        // console.log("email",this.params.email)
        this.loading = false;
        if (window.location.href.indexOf("customer-page") > -1) {
            if(this.params.email){
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
                    this.emailError = response.data.message;
                }else{
                    this.customerInstallments = response.data;
                }
                this.loading = false;
            })
            .catch((error) => {
                console.log("error",error);
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
        resolveClass(data){   
            if(data.status=='Paid'){
                return 'bg-success';
            }
            if(data.status=='Pending'){
                if(moment(data.due_date)<moment())
                return 'bg-danger';
            }
            return 'bg-light';
        },
        resolveHeaderClass(index){
            index = Number(index);
            if(index%2==0){
                return 'bg-primary';
            }
            return 'bg-primary';
        },
        rowClass(item, type) {
            if (!item || type !== 'row') return
            if (item.status === 'Paid' || item.status === 'success') 
                return 'table-success'
            if(item.status === 'Pending'){
                if(moment(item.due_date)<moment()){
                    return 'table-danger';
                }
            }
            if (item.status === 'failed')
                return 'table-danger'
        },
        formatDate(value) {
            return moment(value, 'YYYY-MM-DD').format('dddd, MMMM DD, YYYY');
        },
        formatDateTime(value) {
            return moment(value, 'YYYY-MM-DD').format('dddd, MMMM DD, YYYY H:i');
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
        verifyEmail(){
            this.params.email = this.email;
            this.fetchCustomerDetails();
        },
        showModal(_i, _ips){
            this.modalLoading = true;
            this.modalIndexes = {
                i: _i,
                ips: _ips
            };
            console.log("modalIndex", this.modalIndexes);
            this.modalLoading = false;
            this.$bvModal.show('modal-trans');
        },
        hasTransactions(){
            if(this.hasData(this.customerInstallments, 'installment')) {
                // console.log("installment1", this.customerInstallments.installment);

                if(this.hasData(this.customerInstallments.installment[this.modalIndexes.i], 'installment_payment_schedules')){
                    // console.log("installment2", this.customerInstallments.installment[this.modalIndexes.i].installment_payment_schedules);

                    if(this.hasLength(this.customerInstallments.installment[this.modalIndexes.i].installment_payment_schedules)){

                        if(this.hasData(this.customerInstallments.installment[this.modalIndexes.i].installment_payment_schedules[this.modalIndexes.ips], 'installment_payment_transactions')){
                            // console.log("installment3", this.customerInstallments.installment[this.modalIndexes.i].installment_payment_schedules[this.modalIndexes.ips].installment_payment_transactions);
    
                            if(this.hasLength(this.customerInstallments.installment[this.modalIndexes.i].installment_payment_schedules[this.modalIndexes.ips].installment_payment_transactions)){
                                return true;
                            }
                        }
                    }

                }
            }
            return false;
        },
        hasData(data, key){
            return Object.prototype.hasOwnProperty.call(data, key) ? true : false;
        },
        hasLength(data){
            return Object.keys(data).length > 0 ? true: false;
        }
     }
}
</script>

<style scoped>
.bg-warning{
    background-color: #f8eb93 !important;
}

.bg-info{
    background-color: #78d6e5 !important;
}

.bg-success{
    background-color: #78e5a4 !important;
}

.bg-danger{
    background-color: #f893a1 !important;
}

.bg-primary{
    color: white;
    background-color: #132d50 !important;
}

.profile-content .container{
    background-color: #132d5021 !important;
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
.btn-light{
    color: #000000;
    background-color: #f6f6f6;
    border-color: #d3cfcf;
}

.btn-default{
    color: #fff;
    background-color: #6a7570;
    border-color: #6a7570;
}

.btn-primary{
    border-color: #1f467a;
    color: #1f467a;
}

.btn-outline-primary{
    border-color: #1f467a;
    color: #1f467a;
}

</style>