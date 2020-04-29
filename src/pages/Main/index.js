import React, { useState,useEffect } from 'react';
import './styles.css'

import api from '../../services/api';

import up from '../../images/sprites/up.png';
import left from '../../images/sprites/left.png';
import down from '../../images/sprites/down.png';
import right from '../../images/sprites/right.png';

import pokeball from '../../images/pokeball.png';
import pokeballBlack from '../../images/pokeballBlack.png';

export default function Main(){
  const [ marginLeft,setMarginLeft ] = useState(200)
  const [ marginTop,setMarginTop ] = useState(234)
  const [ onGrass, setOnGrass ] = useState(false)

  const [ playerImg,setPlayerImg ] = useState(down)
  const [ pokemonImg,setPokemonImg ] = useState('');
  const [ chances,setChances ] = useState(3);

  const [ routePokemon,setRoutePokemon ] = useState([1,2,3,4,5,6,7,8,9])

  const [ pokemon, setPokemon ] = useState()
  const [ newPokemon,setNewPokemon ] = useState(routePokemon[Math.floor(Math.random() * routePokemon.length)])
  const [ pokemonArray,setPokemonArray ] = useState([])

  const [ message,setMessage ] = useState('')

  function goLeft(){
    setPlayerImg(left)
    if(marginLeft !== 0){
      setMarginLeft(marginLeft-50)
    }
  }
  function goUp(){
    setPlayerImg(up)
    if(marginTop > 150){
      setMarginTop(marginTop-50)
    }
  }
  function goDown(){
    setPlayerImg(down)
    if(marginTop < 400){
      setMarginTop(marginTop+50)
    }
  }
  function goRight(){
    setPlayerImg(right)
    if(marginLeft < 400){
      setMarginLeft(marginLeft+50)
    }
  }

  function generatePokemon(){
    setNewPokemon(routePokemon[Math.floor(Math.random() * routePokemon.length)])

    async function loadPokemon(){
      const response = await api.get(`/pokemon/${newPokemon}`);

      setPokemon(response.data);
    }
    loadPokemon();
  }

  useEffect(()=>{
    let randomEncounter = Math.floor(Math.random()*3);
    if(
      (marginTop === 434 && marginLeft < 300) ||
      (marginTop === 384 && marginLeft < 100) ||
      (marginTop === 334 && marginLeft < 100) ||
      (marginTop === 284 && marginLeft < 50)
      ){
      setOnGrass(true);
    }else{
      setOnGrass(false);
      setPokemon()
    }

    if(onGrass && randomEncounter === 0){
      generatePokemon()
    }else{
      setPokemon()
    }
  },[marginLeft,marginTop]);

  useEffect(()=>{
    if(pokemon !== undefined){
      let pokemonId = ('000'+(pokemon.id)).slice(-3)
      setPokemonImg(`https://www.serebii.net/sunmoon/pokemon/${pokemonId}.png`)
    }
  },[pokemon])

  function run(){
    setPokemon()
    setChances(3);
  }

  function runButton(){
    run();
    setMessage('');
  }

  function capture(pokemonImg){
    let captureRate = 374 - pokemon.base_experience
    let randomCapture = Math.floor(Math.random() * 374)
    if( randomCapture <= captureRate ){
      setPokemonArray([...pokemonArray,pokemonImg]);
      setMessage('Captured!')
      run()
    }else{
      if(chances !== 1){
        setChances(chances-1);
      }else{
        run();
        setMessage('Oh no!The wild pokémon fled.')
      }
    }
  }

  return(
    <main>

      <div className="mainContainer">

        <div className="gameContainer">
          <img style={{marginLeft,marginTop}} className="player" src={playerImg}/>
        </div>

        <div className="controllerContainer">
          <div className="battleContainer">

            {pokemon == undefined
            ?
            <div className="waitingEncounter">
              <img className="noPokemon" src={pokeballBlack}/>
              <label>{message}</label>
            </div>
            :
            <div className="encountered">
              <div className="chances">
                {chances === 3 ?
                <img src={pokeball}/> :
                <img src={pokeballBlack}/>
                }
                {chances > 1 ?
                <img src={pokeball}/> :
                <img src={pokeballBlack}/>
                }
                {chances > 0 ?
                <img src={pokeball}/> :
                <img src={pokeballBlack}/>
                }
              </div>
              <img className="pokemonImage" src={pokemonImg}/>
              <label> {pokemon.name} </label>
              <div className="actionsContainer">
                <button onClick={()=>capture(pokemonImg)}>Capturar</button>
                <button onClick={runButton}>Fugir</button>
              </div>
            </div>
            }
          </div>

          <div className="buttonContainer">

            <button className="left" onClick={goLeft}>left</button>
            <div className="buttons">
              <button onClick={goUp}>up</button>
              <button onClick={goDown}>down</button>
            </div>
            <button className="right" onClick={goRight}>right</button>

          </div>
        </div>

      </div>

      <div className="captured">
        <h1>Pokemons:</h1>
          {pokemonArray.map((item,index)=>(
            <img key={index} src={item}/>
          ))}
      </div>

    </main>
  )
}