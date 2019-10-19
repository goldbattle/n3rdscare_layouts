'use strict';

module.exports = function(nodecg) {
    try {
        require('./donations')(nodecg);
        require('./countdown')(nodecg);
    } catch (e) {
        nodecg.log.error('Failed to load "donations" lib:', e.stack);
        process.exit(1);
    }
    // try {
    //     require('./omnibar')(nodecg);
    // } catch (e) {
    //     nodecg.log.error('Failed to load "omnibar" lib:', e.stack);
    //     process.exit(1);
    // }
};
