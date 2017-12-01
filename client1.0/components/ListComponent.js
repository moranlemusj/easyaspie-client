import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import geodist from "geodist";

export default class RestoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: []
    };
  }
  // sort data
  componentWillMount() {
    // calculate distance for each location
    this.props.restaurants.results.forEach(item => {
      item.distance = Math.round(
        100 *
          geodist(
            {
              lat: item.geometry.location.lat,
              lon: item.geometry.location.lng
            },
            {
              lat: this.props.location.coords.latitude,
              lon: this.props.location.coords.longitude
            },
            { exact: true, unit: "km" }
          )
      );
      this.state.restaurants.push(item);
    });
    // sort array by distance
    this.state.restaurants.sort((a, b) => {
      return a.distance - b.distance;
    });
  }
  // handle press event
  pressed = id => this.props.handelPress(id);
  // final render -------------------------------------------------------------
  render() {
    return (
      <ScrollView style={styles.listContainer}>
        <List>
          {this.state.restaurants.map((item, key) => (
            <ListItem
              onPress={() => this.pressed(item.place_id)}
              key={key}
              title={(l = item.name)}
              subtitle={item.distance + " meters away"}
            />
          ))}
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 80,
    width: "100%"
  }
});
