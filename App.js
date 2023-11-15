class AttractionsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attractions: [],
            filteredAttractions: [],
            sortDirection: 1,
            sortColumn: "name",
            showAddModal: false,
            selectedAttractionForModify: null,
            showModifyModal: false
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

    sortAttractions = (sortColumn) => {
        let sortedAttractions = [...this.state.filteredAttractions];
        let sortDirection = this.state.sortDirection === 1 ? -1 : 1;

        sortedAttractions.sort((a, b) => {
            if (sortColumn === "name" || sortColumn === "address") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else if (sortColumn === "tags") {
                const tagsA = a[sortColumn].join(", ");
                const tagsB = b[sortColumn].join(", ");
                return tagsA.localeCompare(tagsB) * sortDirection;
            } else if (sortColumn === "free") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else if (sortColumn === "rating") {
                return (a[sortColumn] - b[sortColumn]) * sortDirection;
            } else if (sortColumn === "latitude" || sortColumn === "longitude") {
                return (a[sortColumn] - b[sortColumn]) * sortDirection;
            } else if (sortColumn === "lastUpdate") {
                const dateA = new Date(a[sortColumn]);
                const dateB = new Date(b[sortColumn]);
                return (dateA - dateB) * sortDirection;
            } else {
                return 0;
            }
        });

        this.setState({ filteredAttractions: sortedAttractions, sortColumn, sortDirection: sortDirection });
    };



    filterAttractions = (filterValue, searchQuery) => {
        let filteredAttractions = this.state.attractions;

        if (filterValue !== 'All Areas') {
            const areaRegex = new RegExp(`${filterValue}`, 'i');
            filteredAttractions = filteredAttractions.filter(attraction => areaRegex.test(attraction.address));
        }

        if (searchQuery) {
            const queryRegex = new RegExp(`${searchQuery}`, 'i');
            filteredAttractions = filteredAttractions.filter(attraction => (
                Object.values(attraction).some(value => queryRegex.test(value.toString()))
            ));
        }

        this.setState({ filteredAttractions });
    };


    deleteAttraction = (poiID) => {
        const updatedAttractions = this.state.attractions.filter(attraction => attraction.poiID !== poiID);
        const updatedFilteredAttractions = this.state.filteredAttractions.filter(attraction => attraction.poiID !== poiID);
        this.setState({ attractions: updatedAttractions, filteredAttractions: updatedFilteredAttractions });
    }

    handleAddAttraction = (attractionData) => {
        const { attractions } = this.state;
        const newAttractions = [attractionData, ...attractions];
        this.setState({ attractions: newAttractions, filteredAttractions: newAttractions });
    };

    handleModify = (attraction, e) => {
        e.stopPropagation();

        this.setState({
            selectedAttractionForModify: attraction,
            showModifyModal: true
        });
    };

    render() {
        return (
            <div>
                <FilterAttractions
                    attractions={this.state.attractions}
                    filterAttractions={this.filterAttractions}
                    handleAddAttraction={this.handleAddAttraction} // Direct access, not using this.props
                />
                <TouristAttractionTable
                    attractions={this.state.attractions}
                    filteredAttractions={this.state.filteredAttractions}
                    sortAttractions={this.sortAttractions}
                    sortColumn={this.state.sortColumn}
                    sortDirection={this.state.sortDirection}
                    deleteAttraction={this.deleteAttraction}
                />
            </div>
        );
    }
}

// ... (your existing imports)

class TouristAttractionTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortDirection: 1,
            sortColumn: "name",
            selectedAttraction: null,
            showModal: false,
            // Fix: Add showModifyModal state
            showModifyModal: false,
            selectedAttractionForModify: null,
        };

        this.handleHeaderClick = this.handleHeaderClick.bind(this);
    }

    handleHeaderClick = (e) => {
        let sortColumn = e.target.id;
        this.props.sortAttractions(sortColumn);
    };

    handleRowClick = (attraction) => {
        this.setState({
            selectedAttraction: attraction,
            showModal: true,
        });
    };

    handleCloseModal = () => {
        this.setState({
            selectedAttraction: null,
            showModal: false,
            // Fix: Reset showModifyModal and selectedAttractionForModify on modal close
            showModifyModal: false,
            selectedAttractionForModify: null,
        });
    };

    handleDelete = (poiID, e) => {
        e.stopPropagation();
        this.props.deleteAttraction(poiID);
    };

    // Fix: Add a method to handle modifying attraction
    handleModify = (attraction, e) => {
        e.stopPropagation();

        this.setState({
            selectedAttractionForModify: attraction,
            showModifyModal: true
        });
    };


    render() {
        let attractions = this.props.filteredAttractions.length
            ? this.props.filteredAttractions
            : this.props.attractions;

        let keys =
            attractions.length === 0
                ? []
                : Object.keys(attractions[0]).filter(
                    (key) =>
                        key !== "poiID" &&
                        key !== "latitude" &&
                        key !== "longitude" &&
                        key !== "lastUpdate" &&
                        key !== "imageFileName"
                );

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
                                            <th key={key} id={key} onClick={this.handleHeaderClick} scope="col">
                                                {key.toUpperCase()}{' '}
                                                {this.props.sortColumn === key && this.props.sortDirection === 1
                                                    ? '▲'
                                                    : null}{' '}
                                                {this.props.sortColumn === key && this.props.sortDirection === -1
                                                    ? '▼'
                                                    : null}
                                            </th>
                                        ))}
                                        {/* Add a th for the 'Delete' column */}
                                        <th>Delete</th>
                                        {/* Fix: Add a th for the 'Modify' column */}
                                        <th>Modify</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attractions.map((attraction) => (
                                        <tr key={attraction.poiID} onClick={() => this.handleRowClick(attraction)}>
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
                                                    onClick={(e) => this.handleDelete(attraction.poiID, e)}>
                                                    Delete
                                                </button>
                                            </td>
                                            {/* Fix: Add a button to trigger the modification */}
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => this.handleModify(attraction, e)}>
                                                    Modify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {this.state.showModal && this.state.selectedAttraction && (
                    <AttractionDetailsModal
                        attraction={this.state.selectedAttraction}
                        handleClose={this.handleCloseModal}
                    />
                )}

                {/* Fix: Correct the conditional rendering */}
                {this.state.showModifyModal && this.state.selectedAttractionForModify && (
                    <ModifyAttractionModal
                        attraction={this.state.selectedAttractionForModify}
                        handleClose={this.handleCloseModal}
                        handleModifyAttraction={this.handleModifyAttraction} // Make sure this line is correct
                    />
                )}
            </div>
        );
    }
}





class FilterAttractions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: 'All Areas',
            searchQuery: '',
            showModal: false
        };

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleFilterChange = (e) => {
        const filterValue = e.target.value;
        this.setState({ filterValue });
        this.props.filterAttractions(filterValue, this.state.searchQuery);
    };

    handleSearchChange = (e) => {
        const searchQuery = e.target.value;
        this.setState({ searchQuery });
        this.props.filterAttractions(this.state.filterValue, searchQuery);
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
                <input
                    type="text"
                    placeholder="Search attractions..."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchChange}
                />
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
            latitude: "",
            longitude: "",
            description: "",
            contactNumber: "",
            imageFileName: "",
            lastUpdate: "",
            rating: 0,
            free: "yes"
        };
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    handleAddAttraction = () => {
        const {
            name,
            address,
            tags,
            latitude,
            longitude,
            description,
            contactNumber,
            imageFileName,
            lastUpdate,
            rating,
            free
        } = this.state;

        // Validate the required fields
        if (!name || !address || !tags) {
            console.error('Name, address, and tags are required fields.');
            return;
        }

        const newAttraction = {
            poiID: Date.now(), // Generate a unique ID (You can use a better method for generating unique IDs)
            name: name,
            address: address,
            tags: tags.split(",").map((tag) => tag.trim()),
            latitude: latitude,
            longitude: longitude,
            description: description,
            contactNumber: contactNumber,
            imageFileName: imageFileName,
            lastUpdate: lastUpdate,
            rating: rating,
            free: free
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
                                    Latitude:
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={this.state.latitude}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Longitude:
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={this.state.longitude}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Contact Number:
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={this.state.contactNumber}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Image File Name:
                                    <input
                                        type="text"
                                        name="imageFileName"
                                        value={this.state.imageFileName}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Last Update:
                                    <input
                                        type="text"
                                        name="lastUpdate"
                                        value={this.state.lastUpdate}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Rating:
                                    <input
                                        type="number"
                                        name="rating"
                                        value={this.state.rating}
                                        onChange={this.handleInputChange}
                                    />
                                </label>
                                <label>
                                    Free:
                                    <select
                                        name="free"
                                        value={this.state.free}
                                        onChange={this.handleInputChange}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
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

// AttractionDetailsModal.jsx


class AttractionDetailsModal extends React.Component {
    componentDidMount() {
        this.loadMap();
    }

    loadMap = () => {
        const { attraction } = this.props;

        // Ensure the Google Maps API is available
        if (window.google) {
            const map = new window.google.maps.Map(document.getElementById('google-map'), {
                center: { lat: parseFloat(attraction.latitude), lng: parseFloat(attraction.longitude) },
                zoom: 15,
            });

            const marker = new window.google.maps.Marker({
                position: { lat: parseFloat(attraction.latitude), lng: parseFloat(attraction.longitude) },
                map: map,
                title: attraction.name,
            });
        }
    };

    render() {
        const { attraction } = this.props;
        const imageUrl = `https://source.unsplash.com/800x600/?${attraction.name} Dublin`;


        return (
            <div className="modal" id="attractionDetailsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attraction Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}></button>
                        </div>
                        <div id="google-map" style={{ height: '300px', width: '100%' }}></div>
                        <div className="modal-body">
                            <p>Name: {attraction.name}</p>
                            <p>Address: {attraction.address}</p>
                            {/* ... other fields ... */}
                            {imageUrl && <img src={imageUrl} alt={attraction.name} style={{ maxWidth: '100%' }} />}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.props.handleClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ModifyAttractionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Initialize state properties based on the attraction data
            name: props.attraction ? props.attraction.name : '',
            address: props.attraction ? props.attraction.address : '',
            description: props.attraction ? props.attraction.description : '',
            contactNumber: props.attraction ? props.attraction.contactNumber : '',
            latitude: props.attraction ? props.attraction.latitude : '',
            longitude: props.attraction ? props.attraction.longitude : '',
            // Add other properties as needed
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleModifyAttraction = () => {
        // Create a modified attraction object using the current state
        const modifiedAttraction = {
            ...this.props.attraction,
            name: this.state.name,
            address: this.state.address,
            description: this.state.description,
            contactNumber: this.state.contactNumber,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            // Add other properties as needed
        };

        // Pass the modified attraction to the parent component
        this.props.handleModifyAttraction(modifiedAttraction);

        // Close the modal
        this.props.handleClose();
    };

    render() {
        const { handleClose } = this.props;

        return (
            <div className="modal" id="modifyAttractionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modify Attraction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {/* Input fields for attraction properties */}
                                <div className="mb-3">
                                    <label htmlFor="attractionName" className="form-label">Attraction Name</label>
                                    <input type="text" className="form-control" id="attractionName" name="name" value={this.state.name} onChange={this.handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="attractionAddress" className="form-label">Attraction Address</label>
                                    <input type="text" className="form-control" id="attractionAddress" name="address" value={this.state.address} onChange={this.handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="attractionDescription" className="form-label">Attraction Description</label>
                                    <textarea className="form-control" id="attractionDescription" name="description" value={this.state.description} onChange={this.handleInputChange} />
                                </div>
                                {/* Add other input fields as needed */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleModifyAttraction}>Modify</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


