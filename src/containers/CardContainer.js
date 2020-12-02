import React from 'react'
import FlashCard from '../components/FlashCard'
import CardForm from '../components/CardForm'
import CardSearch from '../components/CardSearch'
import { Button } from 'semantic-ui-react'

class CardContainer extends React.Component{

    state = {
        showCardForm: false,
        searchTerm: '',
        numCardsAdded: 0,
        cards: []
    }

    fetchCards = () => {
        fetch(`http://localhost:3000/categories/${this.props.filteredCategory.id}`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${this.props.jwt}`}
        })
        .then(resp => resp.json())
        .then(category => {
            this.setState({cards: category.cards})
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filteredCategory.id !== this.props.filteredCategory.id && this.props.filteredCategory.id) this.fetchCards()
    }

    componentDidMount() {
        this.fetchCards()
    }

    handleAddCardsCardContainer = (newCard) => {
        this.props.handleAddCard(newCard)
        this.fetchCards()
        this.setState(prevState => {
            return ({numCardsAdded: prevState.numCardsAdded += 1})
        })
    }

    renderCards = () => {
        return this.filterCardsFromSearch().map(card=> <FlashCard key={card.id} card={card} handleDeleteCard={this.props.handleDeleteCard} jwt={this.props.jwt} />)
    }

    handleShowCardForm = () => {
        this.setState(prevState => {
            return ({showCardForm: !prevState.showCardForm})
        })
    }

    filterCardsFromSearch = () => {
        return this.state.cards.filter(card => card.term.toLowerCase().includes(this.state.searchTerm.toLowerCase()) || card.definition.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
    }

    handleCardSearchChange = (searchTerm) => {
        this.setState({searchTerm: searchTerm})
    }

    localHandleDeleteCategory = () => {
        this.props.handleDeleteCategory(this.props.filteredCategory.id)
    }

    render () {
        return (
            <div className="card-container">
                <h1>{this.props.filteredCategory.name} Flash Cards</h1>
                <Button onClick={this.handleShowCardForm}>{this.state.showCardForm ? "Cancel" : "Add Flash Card"}</Button>
                {this.state.showCardForm ?
                <CardForm filteredCategoryId={this.props.filteredCategory.id} handleAddCard={this.handleAddCardsCardContainer} handleShowCardForm={this.handleShowCardForm}/>
                :
                <>
                    <CardSearch searchTerm={this.state.searchTerm} handleCardSearchChange={this.handleCardSearchChange} />
                    <Button onClick={this.props.handleGameState} >Study</Button>
                    <Button onClick={this.localHandleDeleteCategory} >Delete Category</Button>
                    {this.renderCards()}
                </>
                }
            </div>
        )
    }

}

export default CardContainer
