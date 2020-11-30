import React from 'react'
import CategoryContainer from './CategoryContainer'
import CardContainer from './CardContainer'
import { Container } from 'semantic-ui-react'
import GameContainer from './GameContainer'

class MainContainer extends React.Component {

    state = {
        filteredCategory: '',
        filteredCards: [],
        gameState: false,
        categories: [],
        filteredCategories: [],
        showCategoryForm: false
    }

    componentDidMount(){
        fetch('http://localhost:3000/categories')
        .then(response => response.json())
        .then(categories => this.setState({
            categories: categories,
            filteredCategories: categories
        }))
        .catch(err => console.log(err))
    }

    addCategory = (categoryObj) => {
        fetch(`http://localhost:3000/categories`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(categoryObj)
            })
            .then(r => r.json())
            .then(data => this.setState(prevState => {
                return ({
                    categories: [...prevState.categories, data],
                    filteredCategories: [...prevState.filteredCategories, data],
                    showCategoryForm: false,
                    filteredCategory: data,
                    filteredCards: []
                }) 
            }))
      }


    handleFilterCards = (filteredCategory) => {
        this.setState({
            filteredCategory: filteredCategory,
            filteredCards: filteredCategory.cards
        })
    }

    handleAddCard = (newCard) => {
        this.setState(prevState => {
            return ({filteredCards: [...prevState.filteredCards, newCard]})
        })
    }

    handleGameState = () => {
        this.setState(prevState => {
            return ({gameState: !prevState.gameState}) 
        })
    }

    handleDeleteCard = (cardId) => {
        let newFilteredCards = [...this.state.filteredCards]
        const matchedCardIndex = newFilteredCards.findIndex(card => card.id === cardId)
        newFilteredCards.splice(matchedCardIndex, 1)
        this.setState({filteredCards: newFilteredCards})
    }

    handleDeleteCategory = (categoryId) => {
        fetch(`http://localhost:3000/categories/${categoryId}`, {method: 'DELETE'})
        .then(resp => resp.json())
        .then(data => {
            console.log(data, "success!")
            let newFilteredCategories = [...this.state.filteredCategories]
            const matchedCatIndex = newFilteredCategories.findIndex(cat => cat.id === categoryId)
            newFilteredCategories.splice(matchedCatIndex, 1)
            this.setState({categories: newFilteredCategories, filteredCategories: newFilteredCategories,filteredCategory: '',filteredCards: [],})
        })
        .catch(err => console.log(err))
    }

    handleCategorySearchChange = (e) => {
        this.setState({
            filteredCategories: this.state.categories
        });

        this.setState({
            filteredCategories: this.filteredCategory(e.target.value)
        });
    }

    filteredCategory = (searchTerm) => this.state.categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))

    handleShowCategoryForm =() => {
        this.setState(prevState => {
            return({showCategoryForm: !prevState.showCategoryForm})
        })
    }

    render() {
        return (
            <Container>
                <div className="main-container">
                    {this.state.gameState ? 
                    <GameContainer cards={this.state.filteredCards} handleGameState={this.handleGameState}/>
                    :
                    <>
                        <CategoryContainer handleFilterCards={this.handleFilterCards} categories={this.state.categories} filteredCategories={this.state.filteredCategories} showCategoryForm={this.state.showCategoryForm} filteredCategory={this.filteredCategory} handleCategorySearchChange={this.handleCategorySearchChange} handleShowCategoryForm={this.handleShowCategoryForm} addCategory={this.addCategory}/>
                        {this.state.filteredCategory ? <CardContainer filteredCategory={this.state.filteredCategory} filteredCards={this.state.filteredCards} handleAddCard={this.handleAddCard} handleGameState={this.handleGameState} handleDeleteCard={this.handleDeleteCard} handleDeleteCategory={this.handleDeleteCategory}/> : null}
                    </>
                    }
                </div>
            </Container>
        )
    }
}

export default MainContainer
