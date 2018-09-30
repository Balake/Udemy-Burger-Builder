import React, { Component } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0, 
            meat: 0,
        },
        totalPrice: 4,
        purchaseable: false,
        purchasing: false
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        alert('You continue!')
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
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler} 
                        orderTotal={this.state.totalPrice}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                purchaseable={this.state.purchaseable}
                purchasing={this.purchaseHandler}
                price={this.state.totalPrice}/>
            </Aux>
        )
    }
}

export default BurgerBuilder