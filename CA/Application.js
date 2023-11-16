class AttractionsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attractions: [],
            filteredAttractions: [],
            sortDirection: 1,
            sortColumn: "name",
            showAddModal: false
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
            } else if (sortColumn === "contactNumber") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else if (sortColumn === "description") {
                return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
            } else {
                return 0;
            }
        });


        this.setState({ filteredAttractions: sortedAttractions, sortColumn, sortDirection: sortDirection });
    };



    filterAttractions = (filterValue, searchQuery) => {
        let filteredAttractions;

        if (filterValue === "All Areas") {
            filteredAttractions = this.state.attractions;
        } else {
            filteredAttractions = this.state.attractions.filter((attraction) => {
                const areaRegex = new RegExp(`${filterValue}`, "i");
                return areaRegex.test(attraction.address);
            });
        }

        filteredAttractions = filteredAttractions.filter((attraction) =>
            Object.values(attraction).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

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

    render() {
        return (
            <div>
                <FilterAttractions
                    attractions={this.state.attractions}
                    filterAttractions={this.filterAttractions}
                    handleAddAttraction={this.handleAddAttraction}
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

class TouristAttractionTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortDirection: 1,
            sortColumn: "name",
            selectedAttraction: null,
            showModal: false
        };
        this.handleHeaderClick = this.handleHeaderClick.bind(this);
    }

    handleHeaderClick = (e) => {
        let sortColumn = e.target.id;
        this.props.sortAttractions(sortColumn);
    };

    handleDelete = (poiID, e) => {
        e.stopPropagation();

        this.props.deleteAttraction(poiID);
    };

    handleRowClick = (e, attraction) => {
        e.stopPropagation();
        this.setState({
            selectedAttraction: attraction,
            showModal: true
        });
    };



    handleCloseModal = () => {
        this.setState({
            selectedAttraction: null,
            showModal: false
        });
    };


    handleModify = (attraction) => {
        this.setState({
            selectedAttraction: attraction,
            showModifyModal: true,
        });
    };

    handleCloseModifyModal = () => {
        this.setState({
            selectedAttraction: null,
            showModifyModal: false,
        });
    };

    handleModifyAttraction = (modifiedAttraction) => {
        console.log('Updated Attraction:', modifiedAttraction);

        if (this.state.attractions) {
            const index = this.state.attractions.findIndex(
                (attraction) => attraction.poiID === modifiedAttraction.poiID
            );

            if (index !== -1) {
                const updatedAttractions = [...this.state.attractions];
                updatedAttractions[index] = modifiedAttraction;

                const updatedFilteredAttractions = [...this.state.filteredAttractions];
                const filteredIndex = updatedFilteredAttractions.findIndex(
                    (attraction) => attraction.poiID === modifiedAttraction.poiID
                );

                if (filteredIndex !== -1) {
                    updatedFilteredAttractions[filteredIndex] = modifiedAttraction;
                }

                this.setState({
                    attractions: updatedAttractions,
                    filteredAttractions: updatedFilteredAttractions,
                    selectedAttraction: null,
                    showModifyModal: false,
                });
            }
        }
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
                        key !== "imageFileName" &&
                        key !== "description"
                );

        return (
            <div className="container-fluid">
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
                                        <tr key={attraction.poiID} onClick={(e) => this.handleRowClick(e, attraction)}>
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
                                                    onClick={(e) => this.handleDelete(attraction.poiID, e)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.handleModify(attraction);
                                                    }}
                                                >
                                                    Modify
                                                </button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {this.state.showModifyModal && this.state.selectedAttraction && (
                                <ModifyAttractionModal
                                    showModal={this.state.showModifyModal}
                                    handleClose={this.handleCloseModifyModal}
                                    attraction={this.state.selectedAttraction}
                                    attractions={this.props.attractions}
                                    handleModify={this.handleModifyAttraction}
                                />
                            )}


                        </div>
                    </div>
                </div>

                {this.state.showModal && this.state.selectedAttraction && (
                    <AttractionDetailsModal
                        attraction={this.state.selectedAttraction}
                        handleClose={this.handleCloseModal}
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
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleFilterChange = (e) => {
        const filterValue = e.target.value;
        this.setState({ filterValue });
        this.props.filterAttractions(filterValue, this.state.searchQuery);
    };

    handleSearchInputChange = (e) => {
        const searchQuery = e.target.value;
        this.setState({ searchQuery }, () => {
            this.props.filterAttractions(this.state.filterValue, searchQuery);
        });
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
            <nav className="navbar">
                <div className="container">
                    <h1>Dublin Attractions</h1>

                    <div className="navbar-form">
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
                            onChange={this.handleSearchInputChange}
                        />

                        <button type="button"
                            className="btn btn-warning" onClick={this.handleShowModal}>Add Attraction</button>

                        {this.state.showModal && (
                            <AddAttractionModal
                                showModal={this.state.showModal}
                                handleClose={this.handleCloseModal}
                                handleAddAttraction={this.props.handleAddAttraction}
                            />
                        )}
                    </div>
                </div>
            </nav>
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

        if (!name || !address || !tags) {
            console.error('Name, address, and tags are required fields.');
            return;
        }

        const newAttraction = {
            poiID: Date.now(),
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
            <div className="addModal modal" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addModalLabel">Add Attraction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form className="addAttractionForm">
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

class AttractionDetailsModal extends React.Component {
    componentDidMount() {
        this.loadMap();
    }

    loadMap = () => {
        const { attraction } = this.props;
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
        // const imageUrl = `https://source.unsplash.com/800x600/?${attraction.name} Dublin`;


        return (
            <div className="modal attractionDetailsModal" id="attractionDetailsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attraction Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}></button>
                        </div>
                        <div id="google-map" style={{ height: '300px', width: '100%' }}></div>
                        <div className="modal-body">
                            <p className="attractionDetail"><strong>Name:</strong> {attraction.name}</p>
                            <p className="attractionDetail"><strong>Address:</strong> {attraction.address}</p>
                            <p className="attractionDetail"><strong>Description:</strong> {attraction.description}</p>
                            <p className="attractionDetail"><strong>Contact Number:</strong> {attraction.contactNumber}</p>
                            <p className="attractionDetail"><strong>Latitude:</strong> {attraction.latitude}</p>
                            <p className="attractionDetail"><strong>Longitude:</strong> {attraction.longitude}</p>
                            <p className="attractionDetail"><strong>Last Update:</strong> {attraction.lastUpdate}</p>
                            {/* {imageUrl && <img src={imageUrl} alt={attraction.name} style={{ maxWidth: '100%' }} />} */}
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
            modifiedAttraction: { ...props.attraction },
        };
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState((prevState) => ({
            modifiedAttraction: {
                ...prevState.modifiedAttraction,
                [name]: name === 'tags' ? (value ? value.split(',').map(tag => tag.trim()) : []) : value,
            },
        }));
    };

    handleSave = () => {
        const { modifiedAttraction } = this.state;
        const { attractions, handleModify, handleClose } = this.props;

        if (!attractions || !Array.isArray(attractions)) {
            console.error('Attractions is undefined or not an array:', attractions);
            return;
        }

        if (!modifiedAttraction || !modifiedAttraction.poiID) {
            console.error('Invalid modified attraction:', modifiedAttraction);
            return;
        }

        const updatedAttractions = attractions.map(attraction =>
            attraction.poiID === modifiedAttraction.poiID ? modifiedAttraction : attraction
        );

        handleModify(updatedAttractions);
        handleClose();
    };





    render() {
        const { handleClose, showModal } = this.props;
        const { modifiedAttraction } = this.state;

        const tagsString = modifiedAttraction.tags ? modifiedAttraction.tags.join(', ') : '';

        return (
            <div className={`modal ${showModal ? 'show' : ''}`} id="modifyAttractionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content modifyAttractionModalContent">
                        <div className="modal-header modifyAttractionModalHeader">
                            <h5 className="modal-title" id="exampleModalLabel">Modify Attraction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form className="addAttractionForm">
                                <form>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={modifiedAttraction.name}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Address:
                                        <input
                                            type="text"
                                            name="address"
                                            value={modifiedAttraction.address}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Tags:
                                        <input
                                            type="text"
                                            name="tags"
                                            value={tagsString}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Latitude:
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={modifiedAttraction.latitude}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Longitude:
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={modifiedAttraction.longitude}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={modifiedAttraction.description}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Contact Number:
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={modifiedAttraction.contactNumber}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Image File Name:
                                        <input
                                            type="text"
                                            name="imageFileName"
                                            value={modifiedAttraction.imageFileName}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Last Update:
                                        <input
                                            type="text"
                                            name="lastUpdate"
                                            value={modifiedAttraction.lastUpdate}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Rating:
                                        <input
                                            type="number"
                                            name="rating"
                                            value={modifiedAttraction.rating}
                                            onChange={this.handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Free:
                                        <select
                                            name="free"
                                            value={modifiedAttraction.free}
                                            onChange={this.handleInputChange}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </label>
                                </form>
                            </form>
                        </div>
                        <div className="modal-footer modifyAttractionModalFooter">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

