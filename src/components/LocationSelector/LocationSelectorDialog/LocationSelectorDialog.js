import React from 'react';
import PropTypes from 'prop-types';
import bem from '../../../utils/bem';
import LocationCard from '../../LocationCard';
import Button from '../../Buttons/Button';
import { LocationAutocomplete } from '../../LocationAutocomplete';
import { Map } from '../../Map';
import styles from './LocationSelectorDialog.scss';

const { elem } = bem('LocationSelectorDialog', styles);

const LocationSelectorDialog = props => {
    const locationInputRef = React.createRef();

    const {
        /** FieldWrapper props */
        inputPlaceholder,

        /** LocationCard props */
        minRadius,
        maxRadius,
        radiusStep,
        renderRadiusLabel,
        onRemoveLocation,
        doneLabel,

        /** LocationAutocomplete props */
        country,
        initialMapAddress,
        placeTypes,
        noSuggestionsPlaceholder,
        showCountryInSuggestions,
        onLocationAutocompleteError,

        /** Internal use */
        onUpdateLocation,
        selectedLocations,
        getMarkers,
        onAddLocation,
        onCloseModal,
    } = props;

    function handleAddLocation(location) {
        locationInputRef.current.focus();
        onAddLocation(location);
    }

    function handleRemoveLocation(locationId) {
        locationInputRef.current.focus();
        onRemoveLocation(locationId);
    }

    return (
        <>
            <div {...elem('inputLine', props)}>
                <LocationAutocomplete
                    {...elem('searchField', props)}
                    isFocused
                    inputRef={locationInputRef}
                    inputPlaceholder={inputPlaceholder}
                    noSuggestionsPlaceholder={noSuggestionsPlaceholder}
                    onSelectionChange={handleAddLocation}
                    country={country}
                    placeTypes={placeTypes}
                    showCountryInSuggestions={showCountryInSuggestions}
                    onError={onLocationAutocompleteError}
                    hidePoweredByGoogleLogo
                />
                <Button {...elem('button', props)} onClick={onCloseModal} context="brand">
                    {doneLabel}
                </Button>
            </div>
            <div {...elem('locationsWrapper', props)}>
                {!!selectedLocations.length && (
                    <ul {...elem('locationCardsContainer', props)}>
                        {selectedLocations.map(location => (
                            <LocationCard
                                {...elem('locationCard', props)}
                                As="li"
                                key={location.id}
                                locationId={location.id}
                                locationTitle={location.description}
                                distanceRadius={location.radius}
                                sliderLabel={renderRadiusLabel(location.radius)}
                                minRadius={minRadius}
                                maxRadius={maxRadius}
                                radiusStep={radiusStep}
                                onRadiusChange={onUpdateLocation}
                                onDelete={handleRemoveLocation}
                            />
                        ))}
                    </ul>
                )}
                <Map
                    defaultArea={{ address: initialMapAddress || country }}
                    markers={getMarkers()}
                />
            </div>
        </>
    );
};

LocationSelectorDialog.displayName = 'LocationSelectorDialog';

LocationSelectorDialog.propTypes = {
    /** stores an array of selected location objects */
    selectedLocations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            center: PropTypes.shape({
                lng: PropTypes.number.isRequired,
                lat: PropTypes.number.isRequired,
            }).isRequired,
            radius: PropTypes.number.isRequired,
        })
    ).isRequired,
    /** radius label renderer e.g. radius => `+ ${radius} km` */
    renderRadiusLabel: PropTypes.func.isRequired,
    /** min radius value of the slider component */
    minRadius: PropTypes.number.isRequired,
    /** max radius value of the slider component */
    maxRadius: PropTypes.number.isRequired,
    /** radius step value of the slider component */
    radiusStep: PropTypes.number.isRequired,
    /** country where search can take place */
    country: PropTypes.string.isRequired,
    /** address to make initial map centering more specific */
    initialMapAddress: PropTypes.string,
    /**
     * type of locations that should be searched for.
     * For details see: https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest.types
     */
    placeTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** show country name in autocomplete suggestions */
    showCountryInSuggestions: PropTypes.bool,
    /** placeholder for both main field and autocomplete field in modal */
    inputPlaceholder: PropTypes.string.isRequired,
    /** placeholder for empty LocationAutocomplete list */
    noSuggestionsPlaceholder: PropTypes.string.isRequired,
    /** function to be executed if error occurs while fetching suggestions */
    onLocationAutocompleteError: PropTypes.func,
    /** label for the Done button */
    doneLabel: PropTypes.string.isRequired,
    /** function called with location object as an argument when it is selected from the suggestions */
    onAddLocation: PropTypes.func.isRequired,
    /** function called with a location details as an argument to be changed */
    onUpdateLocation: PropTypes.func.isRequired,
    /** function with a locationId as an argument to be removed */
    onRemoveLocation: PropTypes.func.isRequired,
    /** function to calculate marker positions in Map  */
    getMarkers: PropTypes.func.isRequired,
};

LocationSelectorDialog.defaultProps = {
    showCountryInSuggestions: false,
    onLocationAutocompleteError: null,
};

export default LocationSelectorDialog;
