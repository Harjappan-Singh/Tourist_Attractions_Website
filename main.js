"use strict"
const ASCENDING = 1

class AttractionsTable extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            sortDirection: ASC,
            sortColumn: "name"
        }
    }


    componentDidMount() {
        this.props.attractions.sort((a, b) => a["name"] < b["name"] ? -1 : 1)
        this.setState({ sortColumn: "name" })
    }


    static getDerivedStateFromProps(props, state) {
        if (state.attractions !== props.attractions) {
            const sortColumn = "name"
            let sortDirection = state.sortDirection
            if (state.sortColumn === sortColumn) {
                sortDirection = -sortDirection
            }
            else {
                sortDirection = 1
            }

            props.countries.sort((a, b) => a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection)
        }

        return (state.attractions !== props.attractions ? { attractions: props.attractions, sortDirection: 1, sortColumn: "name" } : null)
    }


    handleHeadingSort = e => {
        const sortColumn = e.target.id
        let sortDirection = this.state.sortDirection
        if (this.state.sortColumn === sortColumn) {
            sortDirection = -sortDirection
        }
        else {
            sortDirection = ASC
        }

        this.props.attractions.sort((a, b) => a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection)
        this.setState({ sortDirection: sortDirection, sortColumn: sortColumn })
    }


    render() {
        return (
            <div>
                <table id="countriesTable">
                    <thead>
                        <tr>
                            <th id="name" onClick={this.handleHeaderClick}>Name {(this.state.sortColumn === "name" && this.state.sortDirection === ASC) ? "▲" : null} {(this.state.sortColumn === "name" && this.state.sortDirection === -ASC) ? "▼" : null}</th>
                            <th id="capital" onClick={this.handleHeaderClick}>Capital {(this.state.sortColumn === "capital" && this.state.sortDirection === ASCENDING) ? "▲" : null} {(this.state.sortColumn === "capital" && this.state.sortDirection === -ASCENDING) ? "▼" : null}</th>
                            {(this.props.region === "All Regions") ? (<th id="region" onClick={this.handleHeaderClick}>Region {(this.state.sortColumn === "region" && this.state.sortDirection === ASCENDING) ? "▲" : null} {(this.state.sortColumn === "region" && this.state.sortDirection === -ASCENDING) ? "▼" : null}</th>) : null}
                            <th id="population" onClick={this.handleHeaderClick} className="population">Population {(this.state.sortColumn === "population" && this.state.sortDirection === ASCENDING) ? "▲" : null} {(this.state.sortColumn === "population" && this.state.sortDirection === -ASCENDING) ? "▼" : null}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.countries.map(country => <tr key={country.alpha2Code}><td>{country.name}</td><td>{country.capital}</td>{(this.props.region === "All Regions") ? (<td>{country.region}</td>) : null}<td className="population">{country.population}</td></tr>)}
                    </tbody>
                </table>
            </div>
        )
    }
}


class DropDownRegionsList extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <select name="regions" onChange={this.props.handleRegionsChange}>
                {this.props.regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>
        )
    }
}


class CountriesForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            countries: [],
            selectedCountries: [],
            regions: [],
            selectedRegion: "All Regions"
        }
    }

    componentDidMount() {
        fetch("json/countries.json")
            .then(response => response.json())
            .then(countries => {
                // get the list of unique regions
                let regions = countries.map(country => country.region)
                let uniqueRegions = [...new Set(regions)].sort()
                uniqueRegions.unshift("All Regions") // add "All Regions" to the front of the array
                uniqueRegions[uniqueRegions.indexOf("")] = "None" // replace empty region (i.e. "") with "None"  

                this.setState({ countries: countries, selectedCountries: countries, regions: uniqueRegions })
            })
    }


    handleRegionsChange = e => {
        if (e.target.value === "All Regions") // all countries
        {
            this.setState({ selectedRegion: e.target.value, selectedCountries: this.state.countries })
        }
        else if (e.target.value === "None") // Deal with the two regions Bouvet Island and Heard Island and McDonald Islands that have an empty country.region in the JSON file 
        {
            this.setState({ selectedRegion: e.target.value, selectedCountries: this.state.countries.filter(country => country.region === "") })
        }
        else  // countries from one region
        {
            this.setState({ selectedRegion: e.target.value, selectedCountries: this.state.countries.filter(country => country.region === e.target.value) })
        }
    }


    render() {
        return (
            <div id="countriesDiv">
                <DropDownRegionsList regions={this.state.regions} handleRegionsChange={this.handleRegionsChange} />
                <h1>{this.state.selectedRegion}</h1>
                <CountriesTable countries={this.state.selectedCountries} region={this.state.selectedRegion} />
            </div>
        )
    }
}