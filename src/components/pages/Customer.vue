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
                        <div class="row" v-for="(installment, index) in customerInstallments.installment" v-bind:key="index">
                            <div class="col-md-12" v-if="installment.addon_id">
                                <div class="card">
                                    <div class="card-header bg-success">
                                        <h5><b>{{ installment.addon_id }} ( {{ installment.price | toCurrency }} {{ installment.currency }} )</b></h5>
                                    </div>
                                    <ul class="list-group list-group-flush" style="text-align:left;">
                                        <!-- <li class="list-group-item"><b>{{ installment.price }} {{ installment.currency }}</b></li> -->
                                        <li class="list-group-item"><b>Status:</b> {{ installment.debt_status }}</li>
                                        <li class="list-group-item"><b>Event ID:</b> {{ installment.event_id }}</li>
                                        <li class="list-group-item"><b>CB Invoice ID:</b> {{ installment.cb_invoice_id }}</li>
                                        <li class="list-group-item"><b>Product ID:</b> {{ installment.product_id }}</li>
                                        <li class="list-group-item"><b>Salesforce Sales ID:</b> {{ installment.sf_sales_id }}</li>
                                    </ul>
                                    
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6" v-for="(schedule, key) in installment.installment_payment_schedules"  v-bind:key="key">
                                                <div class="card mb-3" :class="resolveClass(schedule.status)">
                                                    <div class="card-header">
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
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
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

export default {
    name: "Customer",
    data() {
        return {
            loading: false,
            params: {
                hash: '',
                email: ''
            },
            customerInstallments: {},
            url: 'https://login.smartcharts.xyz/sc2-admin/fe-payments/customer-installment'
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
        this.fetchCustomerDetails();
     },
     methods:
     {
        fetchCustomerDetails(){
            this.loading = true;
            axios.post(this.url, 
                { email: this.params.email },
                { headers: {'x-api-key': this.params.hash} }
            );
            // .then( response => {
            //     console.log("response",response);
            //     // this.customerInstallments = response;
            //     this.loading = false;
            // })
            // .catch((error) => {
            //     console.log("error",error);
            //     this.customerInstallments = {};
            //     this.loading = false;
            // });
            // --
            this.customerInstallments = {
                "customer": {
                    "id": 45,
                    "instance": "App\\Instances\\SmartCharts",
                    "salesforce_token": "0010Q00001HM5vLQAT",
                    "chargebee_id": "AzyuBLSXx2tm4ePq",
                    "chargebee_subscription_id": null,
                    "salutation": null,
                    "first_name": "Juan",
                    "last_name": "Cruz",
                    "nickname": null,
                    "email": "ghostdummy2020+new87@gmail.com",
                    "date_of_birth": null,
                    "language": "en",
                    "accepted_terms": 0,
                    "over_18": 0,
                    "edit_lock": 0,
                    "verification_email_sent": 1,
                    "email_modified_by_instance": null,
                    "email_verified_at": null,
                    "initial_demo_account": null,
                    "redirect_url": null,
                    "created_at": "2021-05-20 11:51:47",
                    "updated_at": "2021-05-20 11:51:50",
                    "hasActiveSubscription": false,
                    "profile": {
                        "id": 44,
                        "user_id": 45,
                        "profile_picture": null,
                        "country_of_residence": null,
                        "accepted_terms": 1,
                        "current_stage": null,
                        "is_marketing_journey": 1,
                        "finished_enrolment": 0,
                        "enrolment_purchase_subscription": null,
                        "enrolment_purchase_option": "a3t0Q000000Ad0OQAS",
                        "enrolment_purchase_amount": "9900.00",
                        "affiliate_product_id": "a070Q00000ByQzOQAV",
                        "payment_id": null,
                        "created_at": "2021-05-20 11:51:50",
                        "updated_at": "2021-05-20 11:51:50"
                    }
                },
                "installment": [
                    {
                        "id": 1,
                        "user_id": 45,
                        "installment_subscription_id": 2,
                        "staff_sf_id": null,
                        "staff_sc2_id": null,
                        "sf_sales_id": "a0D0Q000002vHwOUAU",
                        "event_id": "a000Q00000Aki9MQAR",
                        "product_id": "a08w000000eNuKy",
                        "cb_invoice_id": "9887",
                        "price": "4995.00",
                        "currency": "AUD",
                        "addon_id": "learn-forex-elearning-course-aud",
                        "debt_status": "Payment Plan",
                        "sf_sync_status": 1,
                        "created_at": "2021-05-20 11:51:50",
                        "updated_at": "2021-05-20 11:51:57",
                        "installment_payment_schedules": [
                            {
                                "id": 1,
                                "user_id": 45,
                                "installment_payment_id": 1,
                                "staff_sc2_id": null,
                                "sf_payment_schedule_id": "a090Q000006duM3QAI",
                                "sf_payment_schedule_name": "PS-20211695197",
                                "discrepancy_amount": "0.00",
                                "amount": "4000.00",
                                "due_date": "2021-05-20",
                                "currency": "AUD",
                                "payment_method": "card",
                                "amount_paid": "4000.00",
                                "sequence_no": "0",
                                "status": "Paid",
                                "created_at": "2021-05-20 11:51:50",
                                "updated_at": "2021-05-20 11:51:53",
                                "installment_payment_transactions": []
                            },
                            {
                                "id": 2,
                                "user_id": 45,
                                "installment_payment_id": 1,
                                "staff_sc2_id": null,
                                "sf_payment_schedule_id": "a090Q000006duM8QAI",
                                "sf_payment_schedule_name": "PS-20211695198",
                                "discrepancy_amount": "0.00",
                                "amount": "995.00",
                                "due_date": "2021-05-21",
                                "currency": "AUD",
                                "payment_method": null,
                                "amount_paid": "0.00",
                                "sequence_no": "1",
                                "status": "Pending",
                                "created_at": "2021-05-20 11:51:50",
                                "updated_at": "2021-05-20 11:51:54",
                                "installment_payment_transactions": []
                            }
                        ]
                    }
                ]
            };
            //--
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
</style>