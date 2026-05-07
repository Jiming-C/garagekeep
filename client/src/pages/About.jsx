import { motion } from 'framer-motion';
import PageEnter from '../components/PageEnter.jsx';
import { stagger } from '../lib/motion.js';
import s from './About.module.css';

export default function About() {
  return (
    <PageEnter className="page">
      <motion.div {...stagger(0)} className={s.intro}>
        <p className="eyebrow">A small manifesto</p>
        <h1 className={`display-l ${s.h1}`}>Cars that are kept.</h1>
      </motion.div>

      <motion.article {...stagger(0.1)} className={s.body}>
        <p>
          The average car on American roads is twelve and a half years old. Most of them
          are kept by people who care, and quietly outlast the prediction that things
          should be replaced. GarageKeep is built for those people.
        </p>
        <p>
          A car that's kept asks for very little: a date, a mileage, an oil change,
          a tire rotation, attention. The trick is remembering. Service shops keep their
          own logs and then, every five years, lose them. Calendars forget. Spreadsheets
          drift. A leather-bound book in the glove compartment is the gold standard, but
          it's hard to search and harder to back up.
        </p>
        <p>
          GarageKeep is the leather-bound book, with two practical advantages: it tells
          you what's overdue, and it doesn't get left in a glovebox in a car you sold
          last June. It's quiet by design. There are no streaks, no daily reminders, no
          gamification. You open it when you've done a thing, you write the thing down,
          and you close it. The next time you open it, you remember everything.
        </p>
        <p>
          That is the whole product.
        </p>
      </motion.article>

      <motion.div {...stagger(0.22)} className={s.colophon}>
        <hr className="hairline" />
        <dl className={s.metaList}>
          <div>
            <dt className="eyebrow">Built with</dt>
            <dd>Node, Express, Mongoose, React, Vite, Framer Motion.</dd>
          </div>
          <div>
            <dt className="eyebrow">Data sources</dt>
            <dd>NHTSA vPIC for VIN decoding. Imagin.studio for car renders.</dd>
          </div>
          <div>
            <dt className="eyebrow">Type</dt>
            <dd>Fraunces and Inter, both from Google Fonts.</dd>
          </div>
        </dl>
      </motion.div>
    </PageEnter>
  );
}
