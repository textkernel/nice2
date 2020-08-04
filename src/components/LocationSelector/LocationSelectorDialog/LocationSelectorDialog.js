import * as React from 'react';
import PropTypes from 'prop-types';
import { bem } from '../../../utils';
import { LocationCard } from '../../LocationCard';
import { Text } from '../../Text';
import { Slider } from '../../Sliders';
import { Button } from '../../Buttons';
import { LocationAutocomplete } from '../../LocationAutocomplete';
import { Map } from '../../Map';
import { SIZES, ENTER_KEY } from '../../../constants';
import styles from './LocationSelectorDialog.scss';

const { elem } = bem('LocationSelectorDialog', styles);

export const LocationSelectorDialog = (props) => {
    const locationInputRef = React.createRef();

    const {
        /** FieldWrapper props */
        inputPlaceholder,

        /** LocationCard props */
        hasRadius,
        minRadius,
        maxRadius,
        radiusStep,
        renderRadiusLabel,
        onRemoveLocation,
        doneLabel,
        clearLabel,

        /** LocationAutocomplete props */
        country,
        initialMapAddress,
        placeTypes,
        noSuggestionsPlaceholder,
        showCountryInSuggestions,
        onLocationAutocompleteError,

        /** Internal use */
        withoutLocationCards,
        onUpdateLocation,
        selectedLocations,
        getMarkers,
        onAddLocation,
        onRemoveAllLocations,
        onCloseModal,
    } = props;

    const [firstSelectedLocation] = selectedLocations;

    function getDefaultArea() {
        if (initialMapAddress || country) {
            return { address: initialMapAddress || country };
        }

        return undefined;
    }

    function handleAddLocation(location) {
        if (locationInputRef.current && !withoutLocationCards) {
            setTimeout(() => locationInputRef.current.focus());
        }
        onAddLocation(location);
    }

    function handleRemoveLocation(locationId) {
        if (locationInputRef.current) {
            locationInputRef.current.focus();
        }
        onRemoveLocation(locationId);
    }

    function handleRadiusChange(radius) {
        onUpdateLocation(firstSelectedLocation.id, radius);
    }

    function handleInputFormSubmit(e) {
        if (e.key === ENTER_KEY) {
            e.stopPropagation();
            onCloseModal();
        }
    }

    return (
        <>
            <div
                {...elem('inputLine', props)}
                role="presentation"
                onKeyDown={handleInputFormSubmit}
            >
                <LocationAutocomplete
                    {...elem('searchField', props)}
                    isFocused
                    inputRef={locationInputRef}
                    defaultInputValue={
                        withoutLocationCards && firstSelectedLocation
                            ? firstSelectedLocation.description
                            : ''
                    }
                    inputPlaceholder={inputPlaceholder}
                    clearLabel={clearLabel}
                    noSuggestionsPlaceholder={noSuggestionsPlaceholder}
                    onSelectionChange={handleAddLocation}
                    country={country}
                    placeTypes={placeTypes}
                    singleLocation={withoutLocationCards}
                    showCountryInSuggestions={showCountryInSuggestions}
                    onRemoveAllLocations={onRemoveAllLocations}
                    onError={onLocationAutocompleteError}
                    hidePoweredByGoogleLogo
                />
                {hasRadius && withoutLocationCards && selectedLocations.length === 1 && (
                    <div {...elem('slider', props)}>
                        <Slider
                            value={firstSelectedLocation.radius}
                            min={minRadius}
                            max={maxRadius}
                            step={radiusStep}
                            railStyle={{ backgroundColor: 'var(--color-neutral-25)' }}
                            onChange={handleRadiusChange}
                        />
                        <Text size={SIZES[0]} {...elem('sliderLabel', props)}>
                            {renderRadiusLabel(firstSelectedLocation.radius)}
                        </Text>
                    </div>
                )}
                <Button {...elem('button', props)} onClick={onCloseModal} context="brand">
                    {doneLabel}
                </Button>
            </div>
            <div {...elem('locationsWrapper', props)}>
                {!withoutLocationCards && selectedLocations.length > 0 && (
                    <ul {...elem('locationCardsContainer', props)}>
                        {selectedLocations.map((location) => (
                            <LocationCard
                                {...elem('locationCard', props)}
                                As="li"
                                key={location.id}
                                locationId={location.id}
                                locationTitle={location.description}
                                distanceRadius={location.radius}
                                sliderLabel={renderRadiusLabel(location.radius)}
                                hasRadius={hasRadius}
                                minRadius={minRadius}
                                maxRadius={maxRadius}
                                radiusStep={radiusStep}
                                onRadiusChange={onUpdateLocation}
                                onDelete={handleRemoveLocation}
                            />
                        ))}
                    </ul>
                )}
                <Map defaultArea={getDefaultArea()} markers={getMarkers()} />
            </div>
        </>
    );
};

LocationSelectorDialog.displayName = 'LocationSelectorDialog';

LocationSelectorDialog.propTypes = {
    /** defines if location cards should be rendered or not */
    withoutLocationCards: PropTypes.bool,
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
    /** defines if selector has an option to control the radius for a marker */
    hasRadius: PropTypes.bool,
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
    /** label for the Clear button */
    clearLabel: PropTypes.string,
    /** function called with location object as an argument when it is selected from the suggestions */
    onAddLocation: PropTypes.func.isRequired,
    /** function called with a location details as an argument to be changed */
    onUpdateLocation: PropTypes.func.isRequired,
    /** function with a locationId as an argument to be removed */
    onRemoveLocation: PropTypes.func.isRequired,
    /** function to remove all locations */
    onRemoveAllLocations: PropTypes.func,
    /** function to calculate marker positions in Map  */
    getMarkers: PropTypes.func.isRequired,
    /** function to be called when teh Done button is clicked */
    onCloseModal: PropTypes.func,
};

LocationSelectorDialog.defaultProps = {
    hasRadius: false,
    withoutLocationCards: false,
    showCountryInSuggestions: false,
    initialMapAddress: null,
    clearLabel: '',
    onLocationAutocompleteError: null,
    onCloseModal: () => null,
    onRemoveAllLocations: () => null,
};
