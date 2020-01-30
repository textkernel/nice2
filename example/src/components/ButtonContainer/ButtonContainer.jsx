import React from 'react';
import './ButtonContainer.css'

/**
 * An example of how to use OneUI based styling in a component implemented in 
 * a 3rd party application, such as Search!
 *
 * This component is also customizable since its CSS uses variables from the
 * application theme ( ./public/default-app-theme.css).
 */
export const ButtonContainer = ({ children }) => (
    <div className="button-container">
        {children}
    </div>
);
