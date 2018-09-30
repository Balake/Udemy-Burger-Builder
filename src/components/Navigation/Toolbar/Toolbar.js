import React from 'react'
import classes from './Toolbar.css'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import SideDrawerToggle from './sideDrawerToggle/SideDrawerToggle'

const toolbar = (props) => (
    <header className={classes.Toolbar}>
    <SideDrawerToggle clicked={props.sideDrawerToggle}/>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.desktopOnly}>
            <NavigationItems />
        </nav>

    </header>
)

export default toolbar