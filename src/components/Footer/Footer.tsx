import * as React from 'react';
import bem from '../../utils/bem';
import { BlockWidthRestrictor } from '../WidthRestrictor';
import styles from './Footer.scss';
import { LogoTextkernel } from '../Icon';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    /** supply copyright text ready to be rendered instead of the default one */
    copyright?: ReactNode;
    /** Current year to be rendered as a part of copyright note */
    year?: number;
    /** Node(s) to be rendered on the right side of the header */
    children?: ReactNode;
}

const currentYear = new Date().getFullYear();
const { block, elem } = bem('Footer', styles);

const Footer: React.FC<Props> = props => {
    const { copyright, year = currentYear, children, ...rest } = props;

    const tkCopyright = (
        <span>
            {year && `\u00a9 ${year} `}
            <LogoTextkernel {...elem('logo', props)} margin="left" />
        </span>
    );

    return (
        <footer {...rest} {...block(props)}>
            <BlockWidthRestrictor {...elem('wrapper', props)}>
                {copyright || tkCopyright}
                <div {...elem('menu', props)}>{children}</div>
            </BlockWidthRestrictor>
        </footer>
    );
};

Footer.displayName = 'Footer';

export default Footer;
