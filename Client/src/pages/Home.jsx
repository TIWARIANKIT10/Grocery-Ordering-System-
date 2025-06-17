
import React from 'react'
import { MainBanner } from '../component/MainBanner'
import Categories from '../component/Categories';
import  BestSeller  from '../component/BestSeller';
import BottomBanner from '../component/BottomBanner';
import NewsLetter from '../component/NewsLetter'


export const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter/>

    </div>
  )
}
