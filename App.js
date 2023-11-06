// class TouristAttractionTable extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             attractions: []
//         }
//     }
//     componentDidMount() {
//         fetch("attractions.json")
//             .then(res => res.json())
//             .then(data => {
//                 let additional = [
//                     { rating: 4, free: "yes", tags: ["restaurant", "bar"] },
//                     { rating: 5, free: "yes", tags: ["parks", "hotel", "historical"] },
//                     { rating: 0, free: "no", tags: ["historical", "sports"] },
//                     { rating: 1, free: "yes", tags: ["arena", "entertainment", "sports"] },
//                     { rating: 3, free: "no", tags: ["theatre", "hotel"] },
//                     { rating: 2, free: "yes", tags: ["parks", "hotel"] },
//                     { rating: 2, free: "no", tags: ["waterpark", "hotel"] },
//                     { rating: 1, free: "no", tags: ["trust", "old people"] },
//                     { rating: 4, free: "yes", tags: ["hill", "nature"] }
//                 ];

//                 let additionalKeys = Object.keys(additional[0]);

//                 let attractionsData = data;
//                 additional.forEach((field, index) => {
//                     additionalKeys.forEach(fieldKey => {
//                         attractionsData[index][fieldKey] = field[fieldKey];
//                     });
//                 });
//                 this.setState({ attractions: attractionsData })
//             })
//             .catch(e => {
//                 console.log("Error while fetching the data ", e)
//             })
//     }

//     handleHeaderClick = e => {
//         const sortColumn = e.target.id;
//         let sortDirection = this.state.sortDirection;

//         if (this.state.sortColumn === sortColumn) {
//             sortDirection = -sortDirection;
//         } else {
//             sortDirection = ASCENDING;
//         }

//         let sortedCountries = [...this.props.countries];
//         sortedCountries.sort((a, b) => {
//             if (sortColumn === "population") {
//                 return (a[sortColumn] - b[sortColumn]) * sortDirection;
//             } else {
//                 return a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection;
//             }
//         });

//         this.setState({ sortDirection, sortColumn, sortedCountries });
//     };

//     static getDerivedStateFromProps(props, state) {
//         if (state.countries !== props.countries) {
//             const sortColumn = "name";
//             let sortDirection = state.sortDirection;

//             if (state.sortColumn === sortColumn) {
//                 sortDirection = -sortDirection;
//             } else {
//                 sortDirection = ASCENDING;
//             }

//             let sortedCountries = [...props.countries];
//             sortedCountries.sort((a, b) => {
//                 if (sortColumn === "population") {
//                     return (a[sortColumn] - b[sortColumn]) * sortDirection;
//                 } else {
//                     return a[sortColumn] < b[sortColumn] ? -sortDirection : sortDirection;
//                 }
//             });

//             return {
//                 countries: props.countries,
//                 sortedCountries,
//                 sortDirection: 1,
//                 sortColumn: "name"
//             };
//         }

//         return null;
//     }


//     render() {
//         let attractions = this.state.attractions
//         console.log(attractions);
//         let keys = (attractions.length === 0 ? [] : Object.keys(attractions[0]).filter(key => key !== "poiID"))
//         // first render will provide empty array, only after didMount called the array gets filled with objects
//         console.log(keys)
//         const countriesToRender = this.state.sortedCountries || this.props.countries;
//         return (
//             <div className="table-responsive">
//                 <table className="table table-striped table-bordered table-hover">
//                     <thead className="thead-dark">
//                         <tr>
//                             {keys.map(key => <th scope="col">{key.toUpperCase()}</th>)}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {attractions.map((attraction) =>
//                             <tr scope="row" key={attraction.poiID}>
//                                 {keys.map(key => <td>{attraction[key]}</td>)}
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div >
//         )
//     }
// }


// class TouristAttractionTable extends React.Component {
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //         attractions: [],
//     //         sortDirection: 1,
//     //         sortColumn: "name"
//     //     };
//     // }

//     constructor(props) {
//         super(props);
//         this.state = {
//             attractions: [],
//             filteredAttractions: [],
//             filterValue: "All Areas",
//             sortDirection: 1,
//             sortColumn: "name"
//         };
//     }

//     componentDidMount() {
//         fetch("attractions.json")
//             .then(res => res.json())
//             .then(data => {
//                 let additional = [
//                     { rating: 4, free: "yes", tags: ["restaurant", "bar"] },
//                     { rating: 5, free: "yes", tags: ["parks", "hotel", "historical"] },
//                     { rating: 0, free: "no", tags: ["historical", "sports"] },
//                     { rating: 1, free: "yes", tags: ["arena", "entertainment", "sports"] },
//                     { rating: 3, free: "no", tags: ["theatre", "hotel"] },
//                     { rating: 2, free: "yes", tags: ["parks", "hotel"] },
//                     { rating: 2, free: "no", tags: ["waterpark", "hotel"] },
//                     { rating: 1, free: "no", tags: ["trust", "old people"] },
//                     { rating: 4, free: "yes", tags: ["hill", "nature"] }
//                 ];

//                 let additionalKeys = Object.keys(additional[0]);

//                 let attractionsData = data;
//                 additional.forEach((field, index) => {
//                     additionalKeys.forEach(fieldKey => {
//                         attractionsData[index][fieldKey] = field[fieldKey];
//                     });
//                 });
//                 this.setState({ attractions: attractionsData })
//             })
//             .catch(e => {
//                 console.log("Error while fetching the data ", e)
//             })
//     }

//     handleHeaderClick = (e) => {
//         const sortColumn = e.target.id;
//         let sortDirection = this.state.sortDirection;

//         if (this.state.sortColumn === sortColumn) {
//             sortDirection = -sortDirection;
//         } else {
//             sortDirection = 1;
//         }

//         let sortedAttractions = [...this.state.attractions];

//         sortedAttractions.sort((a, b) => {
//             if (sortColumn === "name" || sortColumn === "address") {
//                 return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
//             } else if (sortColumn === "lastUpdate") {
//                 const dateA = new Date(a[sortColumn]);
//                 const dateB = new Date(b[sortColumn]);
//                 return (dateA - dateB) * sortDirection;
//             } else if (sortColumn === "tags") {
//                 const tagsA = a[sortColumn].join(", ");
//                 const tagsB = b[sortColumn].join(", ");
//                 return tagsA.localeCompare(tagsB) * sortDirection;
//             } else if (sortColumn === "free") {
//                 return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
//             } else {
//                 return (a[sortColumn] - b[sortColumn]) * sortDirection;
//             }
//         });

//         this.setState({ sortDirection, sortColumn, attractions: sortedAttractions });
//     };

//     handleFilterChange = (e) => {
//         const filterValue = e.target.value;
//         let filteredAttractions = [];

//         if (filterValue === "All Areas") {
//             filteredAttractions = this.state.attractions;
//         } else {
//             filteredAttractions = this.state.attractions.filter((attraction) => {
//                 const areaRegex = /(?:Dublin\s\d+)/g;
//                 const addressMatch = attraction.address.match(areaRegex);
//                 if (addressMatch) {
//                     return addressMatch[0].toLowerCase() === filterValue.toLowerCase();
//                 }
//                 return false;
//             });
//         }

//         this.setState({ filteredAttractions, filterValue });
//     };

//     render() {
//         let attractions = this.state.filteredAttractions.length ? this.state.filteredAttractions : this.state.attractions;
//         let keys = attractions.length === 0 ? [] : Object.keys(attractions[0]).filter((key) => key !== "poiID");

//         // Extracting areas dynamically from the address
//         let areas = ["All Areas"];
//         attractions.forEach((attraction) => {
//             const areaRegex = /(?:Dublin\s\d+)/g;
//             const addressMatch = attraction.address.match(areaRegex);
//             if (addressMatch && !areas.includes(addressMatch[0])) {
//                 areas.push(addressMatch[0]);
//             }
//         });
//         areas.sort(); // Sorting the areas in ascending order


//         // let attractions = this.state.attractions;
//         // let keys = attractions.length === 0 ? [] : Object.keys(attractions[0]).filter((key) => key !== "poiID");

//         return (
//             <div className="table-responsive">
//                 <div>
//                     <select value={this.state.filterValue} onChange={this.handleFilterChange}>
//                         {areas.map((area, index) => (
//                             <option key={index} value={area}>
//                                 {area}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
{/* <table className="table table-striped table-bordered table-hover">
    <thead className="thead-dark">
        <tr>
            {keys.map((key) => (
                <th key={key} id={key} onClick={this.handleHeaderClick} scope="col">
                    {key.toUpperCase()}{" "}
                    {this.state.sortColumn === key && this.state.sortDirection === 1 ? "▲" : null}{" "}
                    {this.state.sortColumn === key && this.state.sortDirection === -1 ? "▼" : null}
                </th>
            ))}
        </tr>
    </thead>
    <tbody>
        {attractions.map((attraction) => (
            <tr key={attraction.poiID}>
                {keys.map((key) => (
                    <td key={key}>{Array.isArray(attraction[key]) ? attraction[key].join(", ") : attraction[key]}</td>
                ))}
            </tr>
        ))}
    </tbody>
</table> */}
//             </div>
//         );
//     }
// }










// class TouristAttractionTable extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             attractions: [],
//             filteredAttractions: [],
//             sortDirection: 1,
//             sortColumn: "name"
//         };
//     }

//     componentDidMount() {
//         fetch("attractions.json")
//             .then(res => res.json())
//             .then(data => {
//                 let additional = [
//                     { rating: 4, free: "yes", tags: ["restaurant", "bar"] },
//                     { rating: 5, free: "yes", tags: ["parks", "hotel", "historical"] },
//                     { rating: 0, free: "no", tags: ["historical", "sports"] },
//                     { rating: 1, free: "yes", tags: ["arena", "entertainment", "sports"] },
//                     { rating: 3, free: "no", tags: ["theatre", "hotel"] },
//                     { rating: 2, free: "yes", tags: ["parks", "hotel"] },
//                     { rating: 2, free: "no", tags: ["waterpark", "hotel"] },
//                     { rating: 1, free: "no", tags: ["trust", "old people"] },
//                     { rating: 4, free: "yes", tags: ["hill", "nature"] }
//                 ];

//                 let additionalKeys = Object.keys(additional[0]);

//                 let attractionsData = data;
//                 additional.forEach((field, index) => {
//                     additionalKeys.forEach(fieldKey => {
//                         attractionsData[index][fieldKey] = field[fieldKey];
//                     });
//                 });
//                 this.setState({ attractions: attractionsData })
//             })
//             .catch(e => {
//                 console.log("Error while fetching the data ", e)
//             })
//     }

//     static getDerivedStateFromProps(nextProps, prevState) {
//         if (prevState.attractions !== nextProps.attractions || prevState.filteredAttractions !== nextProps.filteredAttractions) {
//             let sortedAttractions = [...nextProps.filteredAttractions];
//             sortedAttractions.sort((a, b) => {
//                 if (prevState.sortColumn === "name" || prevState.sortColumn === "address") {
//                     return a[prevState.sortColumn].localeCompare(b[prevState.sortColumn]) * prevState.sortDirection;
//                 } else if (prevState.sortColumn === "lastUpdate") {
//                     const dateA = new Date(a[prevState.sortColumn]);
//                     const dateB = new Date(b[prevState.sortColumn]);
//                     return (dateA - dateB) * prevState.sortDirection;
//                 } else if (prevState.sortColumn === "tags") {
//                     const tagsA = a[prevState.sortColumn].join(", ");
//                     const tagsB = b[prevState.sortColumn].join(", ");
//                     return tagsA.localeCompare(tagsB) * prevState.sortDirection;
//                 } else if (prevState.sortColumn === "free") {
//                     return a[prevState.sortColumn].localeCompare(b[prevState.sortColumn]) * prevState.sortDirection;
//                 } else {
//                     return (a[prevState.sortColumn] - b[prevState.sortColumn]) * prevState.sortDirection;
//                 }
//             });

//             return { attractions: nextProps.attractions, filteredAttractions: nextProps.filteredAttractions };
//         }
//         return null;
//     }

//     handleHeaderClick = (e) => {
//         const sortColumn = e.target.id;
//         let sortDirection = this.state.sortDirection;

//         if (this.state.sortColumn === sortColumn) {
//             sortDirection = -sortDirection;
//         } else {
//             sortDirection = 1;
//         }

//         let sortedAttractions = [...this.state.attractions];

//         sortedAttractions.sort((a, b) => {
//             if (sortColumn === "name" || sortColumn === "address") {
//                 return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
//             } else if (sortColumn === "lastUpdate") {
//                 const dateA = new Date(a[sortColumn]);
//                 const dateB = new Date(b[sortColumn]);
//                 return (dateA - dateB) * sortDirection;
//             } else if (sortColumn === "tags") {
//                 const tagsA = a[sortColumn].join(", ");
//                 const tagsB = b[sortColumn].join(", ");
//                 return tagsA.localeCompare(tagsB) * sortDirection;
//             } else if (sortColumn === "free") {
//                 return a[sortColumn].localeCompare(b[sortColumn]) * sortDirection;
//             } else {
//                 return (a[sortColumn] - b[sortColumn]) * sortDirection;
//             }
//         });

//         this.setState({ sortDirection, sortColumn, attractions: sortedAttractions });
//     };

//     render() {
//         let attractions = this.state.filteredAttractions.length ? this.state.filteredAttractions : this.props.attractions;
//         let keys = attractions.length === 0 ? [] : Object.keys(attractions[0]).filter((key) => key !== "poiID");

//         return (
//             <div className="table-responsive">
//                 {/* FilterAttractions component */}
//                 <FilterAttractions attractions={this.props.attractions} filterAttractions={this.props.filterAttractions} />
//                 <table className="table table-striped table-bordered table-hover">
//                     <thead className="thead-dark">
//                         <tr>
//                             {keys.map((key) => (
//                                 <th key={key} id={key} onClick={this.handleHeaderClick} scope="col">
//                                     {key.toUpperCase()}{" "}
//                                     {this.state.sortColumn === key && this.state.sortDirection === 1 ? "▲" : null}{" "}
//                                     {this.state.sortColumn === key && this.state.sortDirection === -1 ? "▼" : null}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attractions.map((attraction) => (
//                             <tr key={attraction.poiID}>
//                                 {keys.map((key) => (
//                                     <td key={key}>{Array.isArray(attraction[key]) ? attraction[key].join(", ") : attraction[key]}</td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     }
// }



class AttractionsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attractions: [], // Your attractions data
            filteredAttractions: [],
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
            })
            .catch((error) => {
                console.error("Error while fetching the data", error);
            });
    }

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
                <TouristAttractionTable attractions={this.state.attractions} filteredAttractions={this.state.filteredAttractions} />
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
    }

    handleHeaderClick = (e) => {
        const sortColumn = e.target.id;
        let sortDirection = this.state.sortDirection;

        if (this.state.sortColumn === sortColumn) {
            sortDirection = -sortDirection;
        } else {
            sortDirection = 1;
        }

        let sortedAttractions = [...this.props.attractions];

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

        this.setState({ sortDirection, sortColumn });
    };

    render() {
        let attractions = this.props.filteredAttractions.length ? this.props.filteredAttractions : this.props.attractions;
        let keys = attractions.length === 0 ? [] : Object.keys(attractions[0]).filter((key) => key !== "poiID");

        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            {keys.map((key) => (
                                <th key={key} id={key} onClick={this.handleHeaderClick} scope="col">
                                    {key.toUpperCase()}{" "}
                                    {this.state.sortColumn === key && this.state.sortDirection === 1 ? "▲" : null}{" "}
                                    {this.state.sortColumn === key && this.state.sortDirection === -1 ? "▼" : null}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {attractions.map((attraction) => (
                            <tr key={attraction.poiID}>
                                {keys.map((key) => (
                                    <td key={key}>{Array.isArray(attraction[key]) ? attraction[key].join(", ") : attraction[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}


class FilterAttractions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: "All Areas"
        };
    }

    handleFilterChange = (e) => {
        const filterValue = e.target.value;
        this.setState({ filterValue });
        this.props.filterAttractions(filterValue);
    };

    render() {
        let areas = ["All Areas"];
        this.props.attractions.forEach((attraction) => {
            const areaRegex = /(?:Dublin\s\d+)/g;
            const addressMatch = attraction.address.match(areaRegex);
            if (addressMatch && !areas.includes(addressMatch[0])) {
                areas.push(addressMatch[0]);
            }
        });
        areas.sort();

        return (
            <div>
                <select value={this.state.filterValue} onChange={this.handleFilterChange}>
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