import { Factory } from 'fishery';

import { resetMockDate, setMockDate } from '../../constants/mock_date';
import type { AutomaticGrantFields } from '../../entities/microcms/automatic_grant_fields';
import type { Entry, EntryApiFields } from '../../entities/entry';
import type { Image } from '../../entities/microcms/image';

export const imageFactory = Factory.define<Image>(({ sequence }) => {
  return {
    url: `https://example.com/image_${sequence}.webp`,
    width: 100,
    height: 100,
  };
});

export const categoryFactory = Factory.define<string>(({ sequence }) => {
  return `category_${sequence}`;
});

export const tagFactory = Factory.define<string>(({ sequence }) => {
  return `tag_${sequence}`;
});

export const automaticGrantFieldsFactory = Factory.define<AutomaticGrantFields>(({ sequence }) => {
  return {
    id: `id_${sequence}`,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    publishedAt: new Date().toString(),
    revisedAt: new Date().toString(),
  };
});

export const entrySchemaFactory = Factory.define<EntryApiFields>(({ sequence }) => {
  return {
    title: '2022年の振り返り',
    body: '今年は良くも悪くも某国際球技イベントに振り回された年だった。\n\n## 仕事\n\n社内のエキスパート認定制度で実績としてはまだ足りないけど、これからに期待というポテンシャル枠としてNext Expertsというのに選ばれた。分野としてはアクセシビリティとなる。見習いエキスパート枠に選ばれたことを記念して（？）自社のオウンドメディアでも[インタビューを受けた](https://www.cyberagent.co.jp/way/list/detail/id=27588)。\n\nまたウェブアクセシビリティ基盤委員会(WAIC) 作業部会2(実装)の委員になったのも2022年の始めのほうだった。\n\nこのように社内・社外に向けてアクセシビリティ向上を推進していく立場になったもの、アクセシビリティ向上を社内・社外で推進できたかというと、2022年前半はある程度社内でアクセシビリティ向上に向けた活動をできたが、それを継続する活動はできなかった。また社外に発信するのも5～7月に集中してやったが、それ以降は継続しなかった。\n\n継続できなかった理由としては[2022年、サイバーエージェントのアクセシビリティを振り返る | CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/40544/)に書いた通り、「ビジネスへの貢献があると認められて経済合理性がある状態」にできなかったので自分が推進しないといけない状態になったからだと考えている。\n\nそして2022年の後半は某国際球技イベントに向けて活動していた。大変だったしいろいろ無になったときもあって異動や転職を考えた時期もあった。ただ某国際球技イベントをとても多くの人が楽しんでいるのを見て嬉しくなるとともに頑張ろうと思った。\n\n2023年からはよりプロダクトに近いところで活動するので、その活動を通じてアクセシビリティ向上の経済合理性を証明したいと考えている。\n\n## プライベート\n\n今年の大きな出来事は[京都芸術大学(KUA) 通信教育部芸術学部デザイン科イラストレーションコースに入学した](https://blog.kubosho.com/entries/i-entered-kua)ことだった。\n\nただ仕事やゲームなどでイラストを描くことに対して優先度が下がったり、2022年の後半になるにつれて精神的に辛い時期も増えたり、学校のコミュニティに馴染めなかったりした結果、2022年中は単位を取れずなんのために入学したのか分からない感じになった。自分のお金が無駄になっただけなので人には迷惑かけていないけど。\n\nイラストに対する熱も一段落してしまった感覚がある。大学の授業という形式でイラストを学ぶのに慣れなかったのもあるし、そもそも授業を受けるための力が不足していると感じたので、一旦休学してもう一度本などを見つつイラストを練習したいなと考えている。\n\nあと2022年後半は副鼻腔炎らしき症状で数日ダウンすることを2回やった。どちらも長期休暇中にダウンしていたので仕事にはあまり影響が出なかったものの、長期休暇中にどこにも出かけられない感じになって悲しかった。ただ新型コロナウイルスには罹ってないと判定されたのは良かった。\n\n## まとめ\n\n2023年は継続することを増やす1年にしたい。',
    slug: `slug_${sequence}`,
    excerpt: '今年は良くも悪くも某国際球技イベントに振り回された年だった。',
    heroImage: imageFactory.build(),
    categories: categoryFactory.buildList(1),
    tags: tagFactory.buildList(1),
  };
});

export const entryDataFactory = Factory.define<Entry>(({ afterBuild }) => {
  setMockDate();
  afterBuild(() => {
    resetMockDate();
  });

  const automaticGrantFields = automaticGrantFieldsFactory.build();
  const entrySchema = entrySchemaFactory.build();

  return {
    ...automaticGrantFields,
    ...entrySchema,
  };
});
