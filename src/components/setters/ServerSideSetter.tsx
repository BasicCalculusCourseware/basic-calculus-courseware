// TYPES
import { ChildrenProp } from 'src/interfaces';
// LIB COMPONENTS
import { RecoilRoot } from 'recoil';
// COMPONENTS
import {
    ThemeSetter,
    AuthSetter,
    LayoutSetter,
    SnackbarSetter,
} from 'src/components/setters';

export default function ServerSideSetter({ children }: ChildrenProp) {
    return (
        <RecoilRoot>
            <ThemeSetter>
                <AuthSetter>
                    <LayoutSetter>
                        <SnackbarSetter>{children}</SnackbarSetter>
                    </LayoutSetter>
                </AuthSetter>
            </ThemeSetter>
        </RecoilRoot>
    );
}
