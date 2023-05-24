# Warehouse

This is the frontend client for the farm app of Qzense Labs made using React.

## Libraries used:

- mapbox-gl and react-map-gl
  - For the maps (obviously)
- chart.js and react-chartjs-2
  - For the charts (obviously)
- Material-UI / mui
  - For the styling and all (you know what goes here). Though almost all divs/boxes are styled using css, along with certain other elements such as tabs and buttons.
- Redux
  - For state management (...)

## How to work around the CSS used so far:

Each page/component folder contains a styles.css file in it. The BEM naming convention is used for almost all the class names, i.e., the child element of a named parent element is named as `parentname__childname`, and minor changes to the styling, AKA modifiers, are named as `elementname--modifier`.

For example, Imagine a product shown on an eCommerce platform in the form of a card. This card will contain an image, its title, and its price. The card element itself will be named `card`, while its children will be named `card__image`, `card__title`, `card__price`.

As for the modifiers, lets say the eCommerce platform had a light mode and dark mode, the dark themed card can have its previous classname, i.e., `card` along with its modifier, in this case `card--dark`

## Important Components/Files and what it contains:

### ./src/pages/homePage/Maps.js

This contains the setup for the maps, most of the sources and layers, and the layout for the controls such as the search bar, add button, etc.

### ./src/pages/homePage/Sidebar.js

This contains the layout for the sidebar you see, most of the functionality will be found in the components used in it such as `Weather.js, About.js,`, etc.

### ./src/agent.js

This contains all the API routes to our backend.

### ./src/reducers

This folder contains all the redux states and actions
# Qzense-Warehouse
