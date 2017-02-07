/**
 * Created by beuttlerma on 07.02.17.
 */


function ProgramLine(components, timing, sleep) {
    this.components = components;
    this.timing = timing;
    this.sleep = sleep;
}

module.exports = ProgramLine;
module.exports.TIMING = {
    MACHINE_DECIDES: 0,
    SYNCHRONIZED_START: 1,
    SYNCHRONIZED_END: 2,
    ONE_AFTER_ANOTHER: 3
};