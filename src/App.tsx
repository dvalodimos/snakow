import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Snakow } from './Snakow';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
`;

const Heading = styled.h1`
    margin: 0;
    font-size: 24px;
    text-align: center;
`;

const ScoresRow = styled.div`
    display: flex;
    justify-content: center;
`;

const Scores = styled.div`
    font-weight: 600;
`;

const Info = styled.div`
    margin-left: 20px;
`;

@observer
class App extends React.Component {
    snakow?: Snakow;

    onRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            this.snakow = new Snakow(canvas);
            this.snakow.start();
            this.setState({});
        }
    };

    render() {
        return (
            <Row>
                <Wrapper>
                    <Heading>SNAKOW</Heading>
                    <ScoresRow>
                        <Scores>
                            <span style={{ color: 'red' }}>
                                {this.snakow?.snakes[0].length}
                            </span>
                            {' : '}
                            <span style={{ color: 'black' }}>
                                {this.snakow?.snakes[1].length}
                            </span>
                        </Scores>
                    </ScoresRow>
                    <canvas
                        ref={this.onRef}
                        style={{
                            width: 500,
                            height: 500,
                            border: '1px solid grey',
                        }}
                    />
                </Wrapper>
                <Info>
                    <b>Steuerung</b>
                    <br />
                    Rote Schlange über WASD
                    <br />
                    Schwarze Schlange über die Pfeiltasten
                </Info>
            </Row>
        );
    }
}

export default App;
