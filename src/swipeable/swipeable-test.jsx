import { render, cleanUp } from '../test-utils';

import Swipeable, { getCoordinates } from './swipeable';

describe('swipeable', () => {
    afterEach(cleanUp);

    it('should render without problems', () => {
        const swipeable = render(
            <Swipeable>
                <textbox>{ 'I\'m swipeable' }</textbox>
            </Swipeable>
        ).node;

        expect(swipeable).to.exist;
        expect(swipeable).to.have.text('I\'m swipeable');
    });

    it('should have initial data', () => {
        const swipeable = render(
            <Swipeable delta={ 150 }>
                <textbox>{ 'I\'m swipeable' }</textbox>
            </Swipeable>
        ).instance;

        expect(swipeable.props.delta).to.equal(150);
        expect(swipeable.swipeStartX).to.equal(0);
        expect(swipeable.swipeStartY).to.equal(0);
        expect(swipeable.deltaX).to.equal(0);
        expect(swipeable.deltaY).to.equal(0);
    });

    describe('handlers', () => {
        let spyHandler;
        let swipeable;

        beforeEach(() => {
            spyHandler = sinon.spy();
            swipeable = render(
                <Swipeable>
                    <textbox onMouseDown={ spyHandler } onTouchStart={ spyHandler }>
                        { 'I\'m swipeable' }
                    </textbox>
                </Swipeable>
            );
        });

        it('should call handleSwipeEnd and removeListeners when componentWillUnmount is called', () => {
            swipeable.instance.handleSwipeEnd = spyHandler;
            swipeable.instance.removeListeners = spyHandler;
            swipeable.instance.componentWillUnmount();
            expect(spyHandler).to.have.callCount(2);
        });

        it('should call handleSwipeStart and child onMouseDown when handleMouseDown is called', () => {
            swipeable.instance.handleSwipeStart = spyHandler;
            swipeable.instance.handleMouseDown({});
            expect(spyHandler).to.have.callCount(2);
        });

        it('should add document mousemove and mouseup listeners when handleMouseDown is called', () => {
            swipeable.instance.handleSwipeMove = spyHandler;
            swipeable.instance.handleSwipeEnd = spyHandler;
            swipeable.instance.removeListeners = spyHandler;
            swipeable.instance.handleMouseDown({});
            document.dispatchEvent(new Event('mousemove'));
            document.dispatchEvent(new Event('mouseup'));
            expect(spyHandler).to.have.callCount(3);
        });

        it('shouldn\'t call handleSwipeStart when handleTouchStart is called with 2 or more touches', () => {
            swipeable.instance.handleSwipeStart = spyHandler;
            swipeable.instance.handleTouchStart({ touches: ['touch1', 'touch2'] });
            expect(spyHandler).to.have.callCount(0);
        });

        it('should call handleSwipeStart and child onTouchStart when handleTouchStart is called', () => {
            swipeable.instance.handleSwipeStart = spyHandler;
            swipeable.instance.handleTouchStart({});
            expect(spyHandler).to.have.callCount(2);
        });

        it('should add document touchmove, touchend and touchcancel listeners when handleTouchStart is called', () => {
            swipeable.instance.handleSwipeMove = spyHandler;
            swipeable.instance.handleSwipeEnd = spyHandler;
            swipeable.instance.removeListeners = spyHandler;
            swipeable.instance.handleTouchStart({});
            document.dispatchEvent(new Event('touchmove'));
            document.dispatchEvent(new Event('touchend'));
            document.dispatchEvent(new Event('touchcancel'));
            expect(spyHandler).to.have.callCount(4);
        });

        it('should calculate swipeStartX and swipeStartY when handleSwipeStart is called', () => {
            swipeable.instance.handleSwipeStart({ clientX: 100, clientY: 50 });
            expect(swipeable.instance.swipeStartX).to.equal(100);
            expect(swipeable.instance.swipeStartY).to.equal(50);
        });

        it('should calculate deltaX and deltaY when handleSwipeStart is called', () => {
            swipeable.instance.handleSwipeMove({ clientX: 100, clientY: 50 });
            expect(swipeable.instance.deltaX).to.equal(-100);
            expect(swipeable.instance.deltaY).to.equal(-50);
        });
    });

    describe('swipe directions', () => {
        let swipeable;
        const directions = {
            onSwipeLeft: sinon.spy(),
            onSwipeTop: sinon.spy(),
            onSwipeRight: sinon.spy(),
            onSwipeBottom: sinon.spy()
        };
        const testData = [
            { direction: 'Left', deltaX: 151, deltaY: 0 },
            { direction: 'Top', deltaX: 0, deltaY: 151 },
            { direction: 'Right', deltaX: -151, deltaY: 0 },
            { direction: 'Bottom', deltaX: 0, deltaY: -151 }
        ];

        beforeEach(() => {
            swipeable = render(
                <Swipeable delta={ 150 } { ...directions } >
                    <textbox>{ 'I\'m swipeable' }</textbox>
                </Swipeable>
            );
        });

        testData.forEach(({ direction, deltaX, deltaY }) => (
            it(`should call onSwipe${direction} when it swiped to ${direction} and handleSwipeEnd is called`, () => {
                swipeable.instance.deltaX = deltaX;
                swipeable.instance.deltaY = deltaY;
                swipeable.instance.handleSwipeEnd({});
                expect(directions[`onSwipe${direction}`]).to.have.callCount(1);
            })
        ));
    });

    describe('getCoordinates', () => {
        const clientX = 100;
        const clientY = 500;

        it('should return clientX and clientY from first touch of touch event', () => {
            expect(getCoordinates({ touches: [{ clientX, clientY }] })).to.deep.equal({ clientX, clientY });
        });

        it('should return clientX and clientY from mouse event', () => {
            expect(getCoordinates({ clientX, clientY })).to.deep.equal({ clientX, clientY });
        });
    });
});
