class App extends React.Component {
    constructor() {
        super()
        this.state = {
            attractions: []
        }
    }

    componentDidMount() {
        console.log("componentDidMount")
        fetch("attractions.json")
            .then(res => res.json())
            .then(data => {
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
                this.setState({ attractions: data })
            })
            .catch(e => {
                console.log("Error while fetching the date ", e)
            })
    }

    render() {
        console.log("render")
        console.log(this.state.attractions)
        let attractions = this.state.attractions
        let keys = (attractions.length === 0 ? [] : Object.keys(attractions[0]).filter(key => key !== "poiID"))
        //first render will provide empty array, only after didMount called the array gets filled with objects
        console.log(keys)
        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            {keys.map(key => <th scope="col">{key.toUpperCase()}</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {attractions.map((attraction) =>
                            <tr scope="row" key={attraction.poiID}>
                                {keys.map(key => <td>{attraction[key]}</td>)}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div >
        )
    }
}


