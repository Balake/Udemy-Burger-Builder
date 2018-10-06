import React, { Component } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Loader from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-1ce11.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            }).catch(error => {
                this.setState({error: true})
            })
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        // this.setState({loading: true})
        // // alert('You continue!')
        // // send data to backend
        // // need to target json for firebase
        // const order = {
        //     ingredients: this.state.ingredients,
        //     // Would need to calculate price on server so that customer doesn't manipulate requests for cheaper price
        //     price: this.state.totalPrice.toFixed(2),
        //     customer: {
        //         name: 'Blake',
        //         address: {
        //             street: 'street',
        //             zipcode: '98105',
        //             country: 'USA'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'AS FAST AS POSSIBLE'
        // }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({loading: false, purchasing: false})
        //     })
        //     .catch(error => {
        //         this.setState({loading: false, purchasing: false})
        //     })
        const queryParams = []
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))   
        }
        queryParams.push("price=" + this.state.totalPrice);
        const queryString = queryParams.join('&')

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
    }

    updatePurchaseState  = (updatedIngredients) => {
        const numberOfIngredients = Object.keys(updatedIngredients).reduce((total, igKey) => total + updatedIngredients[igKey], 0)
        this.setState({purchaseable: numberOfIngredients > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.updatePurchaseState(updatedIngredients)
        this.setState({
            totalPrice: newPrice, 
            ingredients: updatedIngredients,
        })
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount > 0) {
            const updatedCount = oldCount - 1
            const updatedIngredients = {
                ...this.state.ingredients
            }
            updatedIngredients[type] = updatedCount
            const priceSubtraction = INGREDIENT_PRICES[type]
            const oldPrice = this.state.totalPrice
            const newPrice = oldPrice - priceSubtraction
            this.updatePurchaseState(updatedIngredients)
            this.setState({
                totalPrice: newPrice, 
                ingredients: updatedIngredients,
            })
        }
        return
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        let orderSummary = null
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }



        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Loader />

        if (this.state.ingredients) {
            burger = 
                <Aux>                
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchaseable={this.state.purchaseable}
                        purchasing={this.purchaseHandler}
                        price={this.state.totalPrice}/>
                </Aux>
            orderSummary = 
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} 
                    orderTotal={this.state.totalPrice}/>
        }
        if (this.state.loading) {
            orderSummary = <Loader />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)