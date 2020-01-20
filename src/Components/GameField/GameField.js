import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import  Octicon , {Person} from '@primer/octicons-react'
import './GameField.css';
import MatchManager from '../../Model/MatchManager'
import CPUMatchManager from '../../Model/CPUMatchManager'
import UserPlayer from '../../Model/UserPlayer'
import Result from './Result/Result'
  


class GameField extends Component
{
    PAUSE = 150;
    clickLine = ()=>{};

    constructor(props)
    {
        super(props);
        this.state = {
            x:props.field.getWidth()-1,
            y:props.field.getHeight()-1,
            match: this.getNewMatchManager(props.field,props.level),
            cpuPlayng:false

        }
        if(this.state.match instanceof CPUMatchManager)
        {
            this.clickLine = async (id)=>{
                if(!this.state.match.isOver())
                {
                    if(this.state.match.userInput)
                    {
                        var match = this.state.match;
                        match.play(id);
                        this.updateMatchState(match);
                        if(this.state.match.currentTurn==1)
                        this.setState({cpuPlayng:true});
                    }
                }
                else
                {
                    console.log('the match is over');
                }
            };

        }
        else this.clickLine = (id)=>{
            if(this.state.match.userInput)
            {
                var match = this.state.match;
                match.play(id);
                this.updateMatchState(match);
            }
        }

    }

    cpu =()=>{

        if (this.state.match.currentTurn==0||this.state.match.isOver()) {
            this.setState({ cpuPlayng: false })
            return
        }
        var match = this.state.match;
        match.cpuPlay();
        this.updateMatchState(match);
                  
    }

    componentDidUpdate()
    {
       if(this.state.cpuPlayng)setTimeout(this.cpu,this.PAUSE);
    }

    updateMatchState(match)
    {
        this.setState({match:match});
    }

    getNewMatchManager(field,level)
    {
        switch (level)
        {
            case 'dummy':return new CPUMatchManager(field,new UserPlayer('You',0),level);
            case 'medium':return new CPUMatchManager(field,new UserPlayer('You',0),level);
            case 'impossible': return new CPUMatchManager(field,new UserPlayer('You',0),level);
            default: return new MatchManager(field, new UserPlayer('Player 1',0),new UserPlayer('Player 2',1));
        }
    }

  

    linecolor(id){
        if(this.state.match.field.getLinePlayer(id)==0)
        return ' line-blue'
        if(this.state.match.field.getLinePlayer(id)==1) return ' line-red'
        
        return ' '
    };

    boxcolor(id){
        var color = this.state.match.field.getBoxPlayer(id);
        if(color==-1)
        return ' '
        else
        {
            if(color==0) return ' bg-blue fillbox'
            else return ' bg-red fillbox'
        }
        
    };

    ifIsTurn(turn)
    {
        if(this.state.match.currentTurn===turn)
        {
            if(turn==0)
            return ' active1';
            else return ' active2';
        }
        else return '';
    }

    gameField(x,y)
    {
        var xs = [...Array(parseInt(x,10)).keys()];
        var ys = [...Array(parseInt(y,10)+1).keys()];
        var gamefield = <>
        <div className="score flex-row" id="score">
                {
                this.state.match.isOver()?<Result result = {this.state.match.getResult()}></Result>
                :<>
                <div className={"flex-row score1"+this.ifIsTurn(0)}>
                <div className="circle bg-main"><Octicon className="p text-blue" icon={Person}></Octicon></div>
             
                    <p>
                        {this.state.match.players[0].name}<br/>
                        <strong>{this.state.match.players[0].score}</strong>
                    </p>
                    </div>
                    <div className={"flex-row score2"+this.ifIsTurn(1)}>
                    <p>
                        {this.state.match.players[1].name}<br/>
                        <strong>{this.state.match.players[1].score}</strong>
                    </p>

                    <div className="circle bg-main"><Octicon className="p text-red" icon={Person}></Octicon></div>
                    </div></>
                }
               
        </div>
        <div className='field'>
            
            { 
                ys.map(ycount =>{

                    if(ycount<y)
                    return  <div className="row" id={ycount} key={ycount} >
                    {xs.map(xcount=>
                    {
                        if(xcount<x-1)
                        return <div className="block" key={xcount+"-"+ycount}>
                       <div className="layer">
                           <div className={"line hor "+this.linecolor(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)} id={xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount} >
                               <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)}></div>
                           </div>
                       </div>
                       <div className="layer">
                           <div className={"line ver "+this.linecolor(xcount+"-"+ycount+" "+xcount+"-"+(ycount+1))} id={xcount+"-"+ycount+" "+xcount+"-"+(ycount+1)} >
                           <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+xcount+"-"+(ycount+1))}></div>
                           </div>
                           <div className={"box " + this.boxcolor(xcount+"-"+ycount)} id={xcount+"-"+ycount}>
                           </div>
                       </div>  
                    </div>;
                    else 
                    return <div className="block" key={xcount+"-"+ycount} >
                       <div className="layer">
                           <div className={"line hor endrow " + this.linecolor(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)} id={xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount}   >
                           <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)}></div>
                           </div>
                       </div>
                       <div className="layer">
                           <div className={"line ver "+this.linecolor(xcount+"-"+ycount+" "+xcount+"-"+(ycount+1))} id={xcount+"-"+ycount+" "+xcount+"-"+(ycount+1)}  >
                           <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+xcount+"-"+(ycount+1))} ></div>
                           </div>
                           <div className={"box " + this.boxcolor(xcount+"-"+ycount)} id={xcount+"-"+ycount}>
                           </div>
                           <div className={"line ver "+this.linecolor((xcount+1)+"-"+ycount+" "+(xcount+1)+"-"+(ycount+1))} id={(xcount+1)+"-"+ycount+" "+(xcount+1)+"-"+(ycount+1)}>
                           <div className="hitbox"  onClick={() => this.clickLine((xcount+1)+"-"+ycount+" "+(xcount+1)+"-"+(ycount+1))}></div>
                           </div>
                       </div>  
                    </div>;
                    })}
                </div>;
                else
                return  <div className="row" id={ycount} key={ycount}>
                    {
                        xs.map(xcount =>{
                            if(xcount<x-1)
                            return <div className="block" key={xcount+"-"+ycount} >
                           <div className="layer">
                               <div className={"line hor"+this.linecolor(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)} id={xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount} >
                               <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)}></div>
                               </div>
                           </div> 
                        </div>;
                        else 
                        return <div className="block" key={xcount+"-"+ycount} >
                           <div className="layer">
                               <div className={"line hor endrow"+this.linecolor(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)} id={xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount} >
                               <div className="hitbox" onClick={() => this.clickLine(xcount+"-"+ycount+" "+(xcount+1)+"-"+ycount)}></div>
                               </div>
                           </div>
                        </div>})
                    }

                </div>
              


                })
            }
        </div></>;

        return gamefield;
    }
    

    render()
    {
        return(
        this.gameField(this.state.x,this.state.y))
    }
}

export default GameField;