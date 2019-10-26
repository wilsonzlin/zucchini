# Architecture

## Observable asynchronous data

## Common styling

## Component

### Factory

### View

### Style

### Store

### Presenter

### State

A state is a class with field methods which represents the externally-visible parts of the store. They are methods (and not getters) to allow for mobx to pick up on usages of them. They are fields so that state can be granularly injected into other components instead of passing the entire state, which would make it harder to test and unnecessarily complex.

### Config

### Worker
