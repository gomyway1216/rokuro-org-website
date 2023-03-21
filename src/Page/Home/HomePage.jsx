import React, { useRef, useEffect, useState } from 'react';
import { useRefContext } from '../../Provider/RefProvider';
import * as informationApi from '../../Firebase/information';
import * as newsLetterApi from '../../Firebase/newsLetter';
import * as postApi from '../../Firebase/post';
import DOMPurify from 'dompurify';
import Items from '../../Component/Item/Items';
import ItemHistory from '../../Component/Item/ItemHistory';
import rokuroIcon from '../../asset/icon/rokuro-icon.png';
import styles from './home-page.module.scss';


const HomePage = () => {
  const { addRefs } = useRefContext();
  const homeRef = useRef();
  const informationRef = useRef();
  const newsLetterRef = useRef();
  const postRef = useRef();
  const [information, setInformation] = useState('');
  const [posts, setPosts] = useState([]);
  const [newsLetters, setNewsLetters] = useState([]);

  const registerRefs = () => {
    const refList = [{ key: 'home', ref: homeRef } , 
      { key: 'information', ref: informationRef }, 
      { key: 'newsLetter', ref: newsLetterRef },
      {key: 'post', ref: postRef }];
    addRefs(refList);
  };

  const getInformation = async () => {
    const info = await informationApi.getInformation();
    setInformation(info.body);
  };

  const getNewsLetters = async () => {
    const result = await newsLetterApi.getPublicNewsLetters();
    setNewsLetters(result);
  };

  const getPosts = async () => {
    const result = await postApi.getPublishedPosts();

    setPosts(result);
  };

  useEffect(() => {
    getInformation();
    getNewsLetters();
    getPosts();
    registerRefs();
  }, []);


  return (
    <div className={styles.root}>
      <div 
        ref={homeRef}
        className={styles.home} name='home'
      >   
        <div className={styles.homeContent}>
          <img src={rokuroIcon} className={styles.logo} />
          <div className={styles.title}>Rokuro Org</div>
          <p className={styles.paragraph}>
            老齢化が進み長距離介護や在米介護をされている方が増加していますが、アメリカでは日本語で行うセミナーはほとんどありません。
          </p>
          <p className={styles.paragraph}>
            情報収集が難しいので、少しでも役に立つ情報提供や交換ができればとこの無料セミナー、無料座談会（日本語）を提供しています。
          </p>
          <p className={styles.paragraph}>
            Rokuro.Orgのプレゼンターは医学部の教授、助教授、医学研究者、医療従事者、弁護士その他色々な分野の専門家や介護経験者です。
          </p>
          <p className={styles.paragraph}>
            Rokuro.Orgはプレゼンターを含む全員がボランティアのグループの活動です。
          非営利団体でも営利団体でもありません。無料でセミナーを提供しています。
          </p>
        </div> 
      </div>  
      <div className={styles.information} ref={informationRef} name="information">
        <div className={styles.informationContent}>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(information)}} />
        </div> 
      </div>
      <div className={styles.itemSection} ref={newsLetterRef} name="newsLetter">
        <div className={styles.title}>ニュースレター</div>
        <div className={styles.contents}>
          <ItemHistory items={newsLetters} section="news-letter"/>
          <Items items={newsLetters} section="news-letter"/>
        </div>
      </div>
      <div className={`${styles.itemSection} ${styles.postSection}`} ref={postRef} name="post">
        <div className={styles.title}>投稿</div>
        <div className={styles.contents}>
          <ItemHistory items={posts} section="post"/>
          <Items items={posts} section="post"/>
        </div>
      </div>
    </div>

  );
};

export default HomePage;