import React from 'react'
import { Link } from 'react-router-dom'
import RekamAyat from '../../components/game/RekamAyat'
import SambungAyat from '../../components/game/SambungAyat'
import TebakAyat from '../../components/game/TebakAyat'
import TebakSurah from '../../components/game/TebakSurah'
import TebakJuz from '../../components/game/TebakJuz'
import TebakTurun from '../../components/game/TebakTurun'

export default function GameList() {
    return (
        <div>
            <div className="grid grid-cols-2 gap-3">
                <RekamAyat/>
                <SambungAyat/>
                <TebakAyat/>
                <TebakSurah/>
                <TebakJuz/>
                <TebakTurun/>
            </div>
        </div>
    )
}
