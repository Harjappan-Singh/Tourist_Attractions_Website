


// let myList = <ul>
//     <li>OOps</li>
//     <li>Full Stack</li>
//     <li>Maths</li>
//     <li>Database</li>
//     <li>Software Testing</li>
// </ul>

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
            .then(data => this.setState({ attractions: data }))
    }

    render() {
        console.log(this.state.attractions)
        console.log("render")

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.attractions.map((attraction) =>
                            <tr key={attraction.poiID}>
                                <td>{attraction.name}</td>
                                <td>{attraction.address}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div >
        )
    }
}
