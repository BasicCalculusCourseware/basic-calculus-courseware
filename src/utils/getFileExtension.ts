// LIB-FUNCTIONS
import _ from 'lodash';

export default function getFileExtension(fileName: string) {
    return _.last(fileName.split('.'));
}
