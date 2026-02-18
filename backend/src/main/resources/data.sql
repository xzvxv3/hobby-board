-- 게시글 --
INSERT INTO post (title, content, author, date) VALUES ('아삭한 사과', '빨갛게 익어 비타민이 풍부하고 아침에 먹기 좋습니다.', 'James', '2024-01-05 10:20:00');
INSERT INTO post (title, content, author, date) VALUES ('달콤한 바나나', '부드러운 식감과 높은 당도로 에너지를 빠르게 보충해줍니다.', 'Emma', '2024-01-12 14:15:30');
INSERT INTO post (title, content, author, date) VALUES ('상큼한 딸기', '새콤달콤한 맛과 향이 일품인 봄의 전령사 과일입니다.', 'Liam', '2024-01-18 09:45:12');
INSERT INTO post (title, content, author, date) VALUES ('시원한 수박', '여름철 수분 보충에 최고인 과일로 속이 꽉 차 있습니다.', 'Olivia', '2024-02-02 22:10:05');
INSERT INTO post (title, content, author, date) VALUES ('보랏빛 포도', '알알이 맺힌 달콤한 과즙이 입안 가득 퍼지는 매력이 있습니다.', 'Noah', '2024-02-08 11:30:45');
INSERT INTO post (title, content, author, date) VALUES ('향긋한 복숭아', '부드러운 과육과 은은한 향이 매력적인 여름 과일입니다.', 'Ava', '2024-02-14 13:05:22');
INSERT INTO post (title, content, author, date) VALUES ('노란 망고', '열대의 향을 가득 담아 진한 달콤함을 선사하는 과일입니다.', 'Ethan', '2024-02-21 17:50:00');
INSERT INTO post (title, content, author, date) VALUES ('새콤한 오렌지', '비타민 C가 가득해 피로 회복과 피부 미용에 아주 좋습니다.', 'Sophia', '2024-03-01 08:20:15');
INSERT INTO post (title, content, author, date) VALUES ('탱글한 블루베리', '안토시아닌이 풍부하여 눈 건강에 도움을 주는 슈퍼푸드입니다.', 'Mason', '2024-03-05 19:40:33');
INSERT INTO post (title, content, author, date) VALUES ('달콤한 멜론', '고급스러운 향과 부드러운 과즙이 특징인 인기 과일입니다.', 'Isabella', '2024-03-10 12:00:00');
INSERT INTO post (title, content, author, date) VALUES ('상큼한 키위', '작은 알갱이가 톡톡 씹히며 소화를 돕는 영양 만점 과일입니다.', 'Lucas', '2024-03-15 15:25:10');
INSERT INTO post (title, content, author, date) VALUES ('단단한 감', '가을의 정취를 담은 달콤하고 아삭한 식감의 과일입니다.', 'Mia', '2024-03-18 21:10:55');
INSERT INTO post (title, content, author, date) VALUES ('새콤달콤 자두', '껍질째 먹으면 상큼함이 배가 되는 여름 별미 과일입니다.', 'Oliver', '2024-03-22 10:05:40');
INSERT INTO post (title, content, author, date) VALUES ('상큼한 파인애플', '강한 단맛과 산미가 어우러져 요리에도 자주 쓰이는 과일입니다.', 'Charlotte', '2024-03-25 23:59:59');

-- 댓글 --
INSERT INTO comment (content, author, post_id) VALUES ('아침 사과는 정말 금사과죠! 매일 챙겨 먹고 있어요.', 'HealthNut', 1);
INSERT INTO comment (content, author, post_id) VALUES ('껍질째 먹는 게 영양가가 더 높다는데 맞나요?', 'ApplePie', 1);

INSERT INTO comment (content, author, post_id) VALUES ('운동 갈 때 바나나 한 개면 든든해서 좋더라고요.', 'GymLife', 2);
INSERT INTO comment (content, author, post_id) VALUES ('반점 생겼을 때가 제일 달고 맛있는 것 같아요.', 'SweetMonkey', 2);

INSERT INTO comment (content, author, post_id) VALUES ('딸기 향만 맡아도 기분이 좋아지네요. 봄이 온 것 같아요!', 'SpringDay', 3);
INSERT INTO comment (content, author, post_id) VALUES ('요즘 딸기 케이크가 너무 먹고 싶었는데 이 글 보니 더 당기네요.', 'CakeLover', 3);

INSERT INTO comment (content, author, post_id) VALUES ('여름엔 수박 화채가 최고죠. 빨리 여름이 왔으면 좋겠어요.', 'SummerFan', 4);
INSERT INTO comment (content, author, post_id) VALUES ('수박 씨 뱉는 게 귀찮지만 시원한 맛에 포기 못 하죠 ㅋㅋ', 'CoolDown', 4);

INSERT INTO comment (content, author, post_id) VALUES ('포도 껍질에 영양분이 많다던데 깨끗이 씻는 법 공유 감사합니다!', 'CleanEater', 5);
INSERT INTO comment (content, author, post_id) VALUES ('청포도도 좋아하시나요? 상큼함이 일품인데 말이죠.', 'GrapeLover', 5);

INSERT INTO comment (content, author, post_id) VALUES ('복숭아 알러지 있는 친구들이 부러워할 만큼 맛있어 보여요.', 'PeachHolic', 6);
INSERT INTO comment (content, author, post_id) VALUES ('황도 vs 백도, 저는 개인적으로 백도파입니다!', 'FruitPicker', 6);

INSERT INTO comment (content, author, post_id) VALUES ('망고는 역시 생망고죠. 필리핀 가서 실컷 먹고 싶네요.', 'Globetrotter', 7);
INSERT INTO comment (content, author, post_id) VALUES ('망고 갈비 뜯어 먹는 재미가 쏠쏠하죠 ㅋㅋ', 'YumYum', 7);

INSERT INTO comment (content, author, post_id) VALUES ('감기 기운 있을 때 오렌지 주스 마시면 직효인 것 같아요.', 'VitaminC', 8);
INSERT INTO comment (content, author, post_id) VALUES ('오렌지 까는 법이 은근 어려운데 쉽게 까는 팁 있나요?', 'OrangeSlice', 8);

INSERT INTO comment (content, author, post_id) VALUES ('눈 건강을 위해서 매일 아침 요거트에 넣어 먹어요.', 'EyeHealth', 9);
INSERT INTO comment (content, author, post_id) VALUES ('블루베리는 냉동해서 먹어도 영양소가 파괴 안 된다니 다행이에요.', 'BerryGood', 9);

INSERT INTO comment (content, author, post_id) VALUES ('멜론에 하몽 얹어 먹으면 와인 안주로 최고입니다.', 'WineParty', 10);
INSERT INTO comment (content, author, post_id) VALUES ('그물 모양이 선명할수록 맛있는 멜론이라더군요!', 'MasterGrocer', 10);


INSERT INTO comment (content, author, post_id) VALUES ('고기 재울 때 키위 넣으면 정말 연해지더라고 Chef 인정!', 'HomeCook', 11);
INSERT INTO comment (content, author, post_id) VALUES ('키위 하나에 비타민C 권장량이 다 들어있다니 대단해요.', 'Nutritionist', 11);

INSERT INTO comment (content, author, post_id) VALUES ('가을 하늘 아래서 먹는 아삭한 단감이 최고죠.', 'AutumnVibe', 12);
INSERT INTO comment (content, author, post_id) VALUES ('곶감 만드는 과정도 올려주시면 재밌을 것 같아요!', 'Tradition', 12);

INSERT INTO comment (content, author, post_id) VALUES ('자두 특유의 새콤한 맛 생각하니 벌써 입에 침이 고여요.', 'SourLover', 13);
INSERT INTO comment (content, author, post_id) VALUES ('장마 전 자두가 제일 맛있다는데 올해도 기대되네요.', 'SeasonWatcher', 13);

INSERT INTO comment (content, author, post_id) VALUES ('고기 먹고 나서 후식으로 파인애플 먹으면 소화가 싹 돼요.', 'DigestBetter', 14);
INSERT INTO comment (content, author, post_id) VALUES ('구워 먹는 파인애플도 은근히 매력 있는 거 아시나요?', 'GrillMaster', 14);