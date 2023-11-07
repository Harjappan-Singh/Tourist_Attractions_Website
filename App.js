class AttractionsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attractions: [],
            filteredAttractions: [],
            sortDirection: 1,
            sortColumn: "name",
            showAddModal: true
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

    deleteAttraction = (poiID) => {
        const updatedAttractions = this.state.attractions.filter(attraction => attraction.poiID !== poiID);
        const updatedFilteredAttractions = this.state.filteredAttractions.filter(attraction => attraction.poiID !== poiID);
        this.setState({ attractions: updatedAttractions, filteredAttractions: updatedFilteredAttractions });
    }

    handleAddAttraction = (attractionData) => {
        const { attractions } = this.state;
        const newAttractions = [...attractions, attractionData];
        this.setState({ attractions: newAttractions, filteredAttractions: newAttractions });
    };

    render() {
        return (
            <div>

                <FilterAttractions attractions={this.state.attractions} filterAttractions={this.filterAttractions} />
                <TouristAttractionTable attractions={this.state.attractions} filteredAttractions={this.state.filteredAttractions}
                    sortAttractions={this.sortAttractions}
                    sortColumn={this.state.sortColumn}
                    sortDirection={this.state.sortDirection}
                    deleteAttraction={this.deleteAttraction} />
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

    handleDelete = (poiID) => {
        this.props.deleteAttraction(poiID);
    }

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
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => this.handleDelete(attraction.poiID)}>
                                                    Delete
                                                </button>
                                            </td>
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
            filterValue: 'All Areas',
            showModal: false
        };

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleFilterChange = (e) => {
        const filterValue = e.target.value;
        this.setState({ filterValue });
        this.props.filterAttractions(filterValue);
    };

    handleShowModal = () => {
        this.setState({ showModal: true });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
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
                <button onClick={this.handleShowModal}>Add Attraction</button>
                {this.state.showModal && (
                    <AddAttractionModal
                        showModal={this.state.showModal}
                        handleClose={this.handleCloseModal}
                        handleAddAttraction={this.props.handleAddAttraction}
                    />
                )}

            </div>
        );
    }
}


class AddAttractionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            tags: "",
            isFree: true,
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    handleAddAttraction = () => {
        const { name, address, tags, isFree } = this.state;
        const newAttraction = {
            name: name,
            address: address,
            tags: tags.split(",").map((tag) => tag.trim()),
            isFree: isFree,
        };

        this.props.handleAddAttraction(newAttraction);
        this.props.handleClose();
    };

    render() {
        if (!this.props.showModal) {
            return null;
        }

        return (
            <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Attraction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        value={this.state.address}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Tags:
                                    <input
                                        type="text"
                                        name="tags"
                                        value={this.state.tags}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Free:
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={this.state.isFree}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.props.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleAddAttraction}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
