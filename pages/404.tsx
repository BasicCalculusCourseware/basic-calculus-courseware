// LIB-COMPONENTS
import Link from 'next/link';
// COMPONENTS
import { Warning, WarningTextIcon, LinkTextSpan } from 'src/components/styled';
import ViewSetter from 'src/components/setters/ViewSetter';

// MAIN-COMPONENT
export default function NotFound() {
    return (
        <ViewSetter pageBase="not-found" isPageUsingSidebar={false}>
            <Warning>
                <WarningTextIcon>404</WarningTextIcon>
                <p>This page is currently unavailable or did not exist.</p>
                <p>
                    Go back to{' '}
                    <Link href="/" passHref>
                        <LinkTextSpan>home</LinkTextSpan>
                    </Link>{' '}
                    page?
                </p>
            </Warning>
        </ViewSetter>
    );
}
