class AttractionsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attractions: [],
            filteredAttractions: [],
            sortDirection: 1,
            sortColumn: "name"
        };
    }

    componentDidMount() {
        fetch("attractions.json")
            .then((res) => res.json())
            .then((data) => {
                let additional = [
                    { rating: 4, free: "yes", tags: ["restaurant", "bar"] },
                    { rating: 5, free: "yes", tags: ["parks", "hotel", "historical"] },
                    { rating: 0, free: "no", tags: ["historical", "sports"] },
                    { rating: 1, free: "yes", tags: ["arena", "entertainment", "sports"] },
                    { rating: 3, free: "no", tags: ["theatre", "hotel"] },
                    { rating: 2, free: "yes", tags: ["parks", "hotel"] },
                    { rating: 2, free: "no", tags: ["waterpark", "hotel"] },
                    { rating: 1, free: "no", tags: ["trust", "old people"] },
                    { rating: 4, free: "yes", tags: ["hill", "nature"] }
                ];

                let additionalKeys = Object.keys(additional[0]);

                let attractionsData = data;
                additional.forEach((field, index) => {
                    additionalKeys.forEach(fieldKey => {
                        attractionsData[index][fieldKey] = field[fieldKey];
                    });
                });
                this.setState({ attractions: attractionsData, filteredAttractions: attractionsData });
                this.sortAttractions(this.state.sortColumn, this.state.sortDirection);
            })
            .catch((error) => {
                console.error("Error while fetching the data", error);
            });
    }

    sortAttractions = (sortColumn, sortDirection) => {

        // console.log("Sorting attractions with column:", sortColumn, "and direction:", sortDirection);
        let sortedAttractions = [...this.state.filteredAttractions];

        sortedAttractions.sort((a, b) => {
            if (sortColumn === "name" || sortColumn === "address") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else if (sortColumn === "lastUpdate") {
                const dateA = new Date(a[sortColumn]);
                const dateB = new Date(b[sortColumn]);
                return (dateA - dateB) * sortDirection;
            } else if (sortColumn === "tags") {
                const tagsA = a[sortColumn].join(", ");
                const tagsB = b[sortColumn].join(", ");
                return tagsA.localeCompare(tagsB) * sortDirection;
            } else if (sortColumn === "free") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else {
                return (a[sortColumn] - b[sortColumn]) * sortDirection;
            }
        });
        // console.log("Sorted attractions:", sortedAttractions);
        this.setState({ filteredAttractions: sortedAttractions, sortColumn, sortDirection });
    };

    filterAttractions = (filterValue) => {
        if (filterValue === "All Areas") {
            // If "All Areas" is selected, show all attractions
            this.setState({ filteredAttractions: this.state.attractions });
        } else {
            // Filter attractions based on the selected area
            const filteredAttractions = this.state.attractions.filter((attraction) => {
                const areaRegex = new RegExp(`${filterValue}`, "i"); // Case-insensitive matching
                return areaRegex.test(attraction.address);
            });
            this.setState({ filteredAttractions });
        }
    };

    render() {
        return (
            <div>
                <FilterAttractions attractions={this.state.attractions} filterAttractions={this.filterAttractions} />
                <TouristAttractionTable attractions={this.state.attractions} filteredAttractions={this.state.filteredAttractions}
                    sortAttractions={this.sortAttractions}
                    sortColumn={this.state.sortColumn}
                    sortDirection={this.state.sortDirection} />
            </div>
        );
    }
}

class TouristAttractionTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortDirection: 1,
            sortColumn: "name"
        };
        this.handleHeaderClick = this.handleHeaderClick.bind(this);
    }

    handleHeaderClick = (e) => {
        let sortColumn = e.target.id;
        this.props.sortAttractions(sortColumn);
    };

    render() {
        let attractions = this.props.filteredAttractions.length
            ? this.props.filteredAttractions
            : this.props.attractions;
        let keys =
            attractions.length === 0
                ? []
                : Object.keys(attractions[0]).filter((key) => key !== "poiID");

        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Tourist Attractions</h1>
                <p className="mb-4">Here is your data table:</p>
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        {keys.map((key) => (
                                            <th
                                                key={key}
                                                id={key}
                                                onClick={this.handleHeaderClick}
                                                scope="col"
                                            >
                                                {key.toUpperCase()}{' '}
                                                {this.props.sortColumn === key && this.props.sortDirection === 1 ? '▲' : null}{' '}
                                                {this.props.sortColumn === key && this.props.sortDirection === -1 ? '▼' : null}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attractions.map((attraction) => (
                                        <tr key={attraction.poiID}>
                                            {keys.map((key) => (
                                                <td key={key}>
                                                    {Array.isArray(attraction[key])
                                                        ? attraction[key].join(', ')
                                                        : attraction[key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



class FilterAttractions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: 'All Areas'
        };
    }

    handleFilterChange = (e) => {
        const filterValue = e.target.value;
        this.setState({ filterValue });
        this.props.filterAttractions(filterValue);
    };

    render() {
        let areas = ['All Areas'];
        this.props.attractions.forEach((attraction) => {
            const areaRegex = /(?:Dublin\s\d+)/g;
            const addressMatch = attraction.address.match(areaRegex);
            if (addressMatch && !areas.includes(addressMatch[0])) {
                areas.push(addressMatch[0]);
            }
        });
        areas.sort();

        return (
            <div className="form-group">
                <label htmlFor="filterSelect">Filter by Area:</label>
                <select
                    className="form-control"
                    id="filterSelect"
                    value={this.state.filterValue}
                    onChange={this.handleFilterChange}
                >
                    {areas.map((area, index) => (
                        <option key={index} value={area}>
                            {area}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}