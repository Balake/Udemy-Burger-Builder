import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'


class ContactData extends Component {
    state = {
        name: '',
        email: '', 
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props)
        this.setState({loading: true})
        // alert('You continue!')
        // send data to backend
        // need to target json for firebase
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            // Would need to calculate price on server so that customer doesn't manipulate requests for cheaper price
            customer: {
                name: 'Blake',
                address: {
                    street: 'street',
                    zipcode: '98105',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'AS FAST AS POSSIBLE'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false})
                this.props.history.push('/')
            })
            .catch(error => {
                this.setState({loading: false})
            })
        console.log(this.props.ingredients);
    };

    render () {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }


        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    };
}

export default ContactData;