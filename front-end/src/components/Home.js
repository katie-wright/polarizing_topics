import React, {Component} from 'react';

class Home extends Component{
    render(){
        return (
            <div className="container">
                    <h2 className="text-center"> How to Play </h2>
                    <div className="row">
                        <h4> <strong> Play mode: </strong></h4>
                        <div className="col-sm-6">
                            <p><strong> Multi-View Play: </strong> </p>
                            <p> The "game master" inputs the number of players in the game and clicks Start. </p>
                            <p> All other players can then click Join. Only the specified number of players can join at one time. </p>
                            <p> The topic will appear and everyone votes thumbs up or down to the topic on their own device. </p>
                            <p> Once voting has finished (the number of votes recieved is equal to the number of players), you will be notified who had the majority vote. </p>
                            <p> The topic will then automatically go to the next card. When all cards are complete, the game will automatically end. </p>
                            <p> At any time, if the game master clicks End Game, or exits the Play mode, the game will end for everyone. </p>
                        </div>
                        <div className="col-sm-6">
                            <p> <strong> Traditional Play: </strong> </p>
                            <p> The game master will input number of players as 1 and start the game, only visible to them. </p>
                            <p> The game master will read the topic listed out loud to a group of players. </p>
                            <p> All players hold out their fist and count to three. </p>
                            <p> On three, all players give thumbs up or thumbs down depending on how they feel about the topic. </p>
                            <p> The game master can click thumbs up or thumbs down depending on how the group voted to switch to the next card. </p>
                        </div>
                    </div>
                <p> <strong> For players 19+:</strong> If you are in the minority vote, you drink! If the vote is tied, everyone drinks!</p>
                    <div className="row">
                        <h4> <strong> Vote or Submit Topics mode: </strong> </h4>
                            <div className="col-xs-12">
                                <p> Submit topics that you feel might be polarizing. </p>
                                <p> Sign up or log in if you would like your topics to be linked to your username. Otherwise, you can remain anonymous. </p>
                                <p> Vote thumbs up or thumbs down to previously submitted topics based on how you feel about it. i.e. If you hate pineapples on pizza, you would give thumbs down to the Hawaiian Pizza topic. </p>
                                <p> Topics that have around a 50% split of the vote (within 20%) will be included in the Play mode. </p>
                                <p> If the opinion on a topic is unanimously thumbs up or thumbs down (within 5%) will be permanently deleted. </p>
                            </div>
                    </div>
                <h2 className="text-center"> The Story </h2>
                <p> Polarizing Topics is a game that all started over the great debate of Hawaiian Pizza, yes or no? It was observed that society is truly split on this topic and thus it was deemed "polarizing". </p>
                <p> As more Polarizing Topics were discovered, they were all added to a static list and circulated via text. The drinking game version of Polarizing Topics has been played around the world! </p>
                <p> Now with the web version, the list can be constantly changing and anyone can add. Plus, only the truly polarizing topics will be included in the game. </p>
            </div>
        )
    }
}

export default Home;