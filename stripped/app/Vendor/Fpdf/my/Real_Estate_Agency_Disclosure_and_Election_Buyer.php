<?php
require('fpdf.php');
	//  Define variable
	$info=array();
	$info['firm_name']='THE RR Software';
	$info['licenses_name']='1203456789ltd';
	$info['print_name']='Rabeya';
	$info['signed_name']='Reza';
	$info['signed_date']='12-07-2014';
	
class PDF extends FPDF
{
var $B;
var $I;
var $U;
var $HREF;

function PDF($orientation='P', $unit='mm', $size='A4')
{
    // Call parent constructor
    $this->FPDF($orientation,$unit,$size);
    // Initialization
    $this->B = 0;
    $this->I = 0;
    $this->U = 0;
    $this->HREF = '';
}

function WriteHTML($html)
{
    // HTML parser
    $html = str_replace("\n",' ',$html);
    $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
    foreach($a as $i=>$e)
    {
        if($i%2==0)
        {
            // Text
            if($this->HREF)
                $this->PutLink($this->HREF,$e);
            else
                $this->Write(5,$e);
        }
        else
        {
            // Tag
            if($e[0]=='/')
                $this->CloseTag(strtoupper(substr($e,1)));
            else
            {
                // Extract attributes
                $a2 = explode(' ',$e);
                $tag = strtoupper(array_shift($a2));
                $attr = array();
                foreach($a2 as $v)
                {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr)
{
    // Opening tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Closing tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modify style and select corresponding font
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}


//Cell with horizontal scaling if text is too wide
	function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
	{
		//Get string width
		$str_width=$this->GetStringWidth($txt);

		//Calculate ratio to fit cell
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$ratio = ($w-$this->cMargin*2)/$str_width;

		$fit = ($ratio < 1 || ($ratio > 1 && $force));
		if ($fit)
		{
			if ($scale)
			{
				//Calculate horizontal scaling
				$horiz_scale=$ratio*100.0;
				//Set horizontal scaling
				$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
			}
			else
			{
				//Calculate character spacing in points
				$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
				//Set character spacing
				$this->_out(sprintf('BT %.2F Tc ET',$char_space));
			}
			//Override user alignment (since text will fill up cell)
			$align='';
		}

		//Pass on to Cell method
		$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

		//Reset character spacing/horizontal scaling
		if ($fit)
			$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
	}

	//Cell with horizontal scaling only if necessary
	function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
	}

	//Cell with horizontal scaling always
	function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
	}

	//Cell with character spacing only if necessary
	function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
	}

	//Cell with character spacing always
	function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		//Same as calling CellFit directly
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
	}

	//Patch to also work with CJK double-byte text
	function MBGetStringLength($s)
	{
		if($this->CurrentFont['type']=='Type0')
		{
			$len = 0;
			$nbbytes = strlen($s);
			for ($i = 0; $i < $nbbytes; $i++)
			{
				if (ord($s[$i])<128)
					$len++;
				else
				{
					$len++;
					$i++;
				}
			}
			return $len;
		}
		else
			return strlen($s);
	}





//  Code for creating pdf

// Page header
function Header()
{
		$this->SetFont('Arial','B',10);
		$this->Cell(0,1,'Presidential Realty',0,1,'L');
		$this->SetFont('Arial','B',16);
		$this->Cell(100,12,'REAL ESTATE AGENCY DISCLOSURE AND ELECTION',0,0,'L');
		$this->SetFont('Arial','',10);
		$this->SetX(170);
		$this->Cell(0,4,'Document updated:','L',0,'');
		$this->Ln();
		$this->SetX(170);
		$this->SetFont('Arial','B',10);
		$this->Cell(0,8,'February 2011','L',1,'C');
		
		$this->Cell(50,28,$this->Image('images/arizona_left.png',10, $this->GetY()+4,50,20),'1',0,'C');
		$this->SetFont('Arial','B',9);
		
		$this->MultiCell(110,4,"The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. Any change in the pre-printed language of this form must be made in a prominent manner. No representations are made as to the legal validity, adequacy and/or effects of any provision, including tax consequences thereof. If you desire legal, tax or other professional advice, please consult your attorney, tax advisor or professional consultant.",'1','L');
		$this->SetY(23);
		$this->SetX(170);
		$this->Cell(30,28,$this->Image('images/arizona_right.png',172, $this->GetY()+6,25,0),'1',0,'C');
    
}

// Page footer
function Footer()
{	
	global $info;
	$str1=utf8_decode('Real Estate Agency Disclosure and Election . Updated: January 2009 . Copyright © 2009 Arizona Association of REALTORS®. All rights reserved.');
	$str2=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026.');
	$this->Cell(25,5,'','',1,'');
	
	$this->Cell(170,1,'','B',1,'');  	
	$this->Cell(170,5,$str1,'',1,'C'); 
	$this->Cell(170,5,'','T',1,''); 
	$this->Cell(100,5,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',0,'L'); 	
	$this->Cell(40,5,'Phone: Fax:480-235-1400','',0,'');
	$this->Cell(30,5,"480-212-5464",'',1,'');
	$this->Cell(20,1,'','',1,'');  
	$this->Cell(30,5,"Steve Peterson",'',0,'');
	$this->Cell(85,5,$str2,0,0,'C');
	$this->Cell(30,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
	$this->Cell(10,5,"delete",'',1,'');
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+175,$this->GetY()-20,15,0);
	$this->Ln();
	
	
	

	
}




}

$pdf = new PDF('P','mm',array(215,335));
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetY(24);
$pdf->SetX(22);
$pdf->Ln();	

//text
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,6,'1.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(35,6,'Firm Name ("Broker")','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(150,6,$info['firm_name'],'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'2.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,8,"acting through",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(110,6,$info['licenses_name'],'B',0,'');
	$pdf->Cell(50,8,"hereby makes the following disclosure.",'',0,'');
	$pdf->Ln();
	$pdf->SetFont('Arial','B',6);
	$pdf->Cell(200,1,"LICENSEE'S NAME",'',1,'C');
	
	$pdf->Cell(200,5,"",'',1,'');
	$pdf->SetLineWidth('1');
	$pdf->SetDrawColor(0,0,0);
	$pdf->Line(12,$pdf->GetY(),205,$pdf->GetY());
	$pdf->SetLineWidth('');
	$pdf->SetFont('Arial','B',9);
	$pdf->Cell(10,6,'','',0,'');
	$pdf->Cell(110,6,'DISCLOSURE ','',1,'');
	$pdf->Cell(10,6,'','',0,'');
	$pdf->Cell(0,2,"",'T',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'3.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(12,4,'Before a','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(150,4,'Seller or Landlord (hereinafter referred to as "Seller") or a Buyer or Tenant (hereinafter referred to as "Buyer")','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,4,'enters into','',1,'');
	

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'4.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'a discussion with a real estate broker or licensee affiliated with a broker, the Seller and the Buyer should understand what type of agency"','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'5.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'relationship or representation they will have with the broker in the transaction.','',1,'');


	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'6.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,4,"I. Buyer's Broker: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"A  broker  other than  the  Seller's  broker can  agree  with  the Buyer  to  act as the  broker for  the  Buyer.  In these",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,5,'7.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"situations,  the  Buyer's  broker  is  not  representing  the  Seller,  even  if  the  Buyer's  broker  is  receiving  compensation  for  services",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'8.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"rendered, either in full or in part, from the Seller or through the Seller's broker:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,5,'9.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"a) A Buyer's broker has the fiduciary duties of loyalty, obedience, disclosure, confidentiality, and accounting in dealings with the Buyer.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'10.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'b) Other  potential  Buyers  represented  by  broker  may  consider,  make  offers  on,  or  acquire  an  interest  in  the  same  or  similar','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'11.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'properties as Buyer is seeking.','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'12.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,4,"II.Seller's Broker:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"II.Seller's Broker: A broker under a listing agreement with the Seller acts as the broker for the Seller only:",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,5,'13.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"a) A Seller's broker has the fiduciary duties of loyalty, obedience, disclosure, confidentiality, and accounting in dealings with the Seller.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'14.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"b) Other potential Sellers represented by broker may list properties that are similar to the property that Seller is selling.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'15.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(100,4,'III. Broker Representing both Seller and Buyer (Limited Representation):','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'A broker, either acting directly or through one or more','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,5,'16.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'licensees within the same brokerage firm, can legally represent both the Seller and the Buyer in a transaction, but only with the','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'17.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'knowledge and informed consent of  both the Seller and the Buyer. In these situations, the Broker, acting through its  licensee(s),','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'18.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'represents both the Buyer and the Seller, with limitations of the duties owed to the Buyer and the Seller:','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'19.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'a) The broker will not, without written authorization, disclose to the other party that the Seller will accept a price or terms other than','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'20.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'stated in the listing or that the Buyer will accept a price or terms other than offered.','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'21.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'b) There will be conflicts in the duties of loyalty, obedience, disclosure and confidentiality. Disclosure of confidential information may','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'22.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'be made only with written authorization.','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'23.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'Regardless of who the Broker represents in the transaction, the Broker shall exercise reasonable skill and care in the performance of the','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'24.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"Broker's duties and shall be truthful and honest to both the Buyer and Seller and shall disclose all known facts which materially and adversely",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'25.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"affect the consideration to be paid by any party. Pursuant to A.R.S. $32-2156, Sellers, Lessors and Brokers are not obligated to disclose that",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'26.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'a property is or has been: (1) the site of a natural death, suicide, homicide, or any crime classified as a felony; (2) owned or occupied by a','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'27.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'person exposed to HIV, or diagnosed as having AIDS or any other disease not known to be transmitted through common occupancy of real','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'28.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"estate; or (3) located in the vicinity of a sex offender. Sellers or Sellers' representatives may not treat the existence, terms, or conditions of",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'29.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'offers as confidential unless there is a confidentiality agreement between the parties.','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'30.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,4,'THE DUTIES OF THE BROKER IN A REAL ESTATE TRANSACTION DO NOT RELIEVE THE SELLER OR THE BUYER FROM THE','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'31.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,4,'RESPONSIBILITY  TO  PROTECT  THEIR  OWN  INTERESTS.  THE  SELLER  AND  THE  BUYER  SHOULD  CAREFULLY  READ  ALL','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,4,'32.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,4,'AGREEMENTS TO ENSURE THAT THE DOCUMENTS ADEQUATELY EXPRESS THEIR UNDERSTANDING OF THE TRANSACTION.
	ELECTION','',1,'');
	
	$pdf->SetFont('Arial','B',9);
	$pdf->Cell(15,6,'','',0,'');
	$pdf->Cell(110,6,'ELECTION  ','',1,'');
	$pdf->SetLineWidth('1');
	$pdf->SetDrawColor(0,0,0);
	$pdf->Line(15,$pdf->GetY(),205,$pdf->GetY());
	$pdf->SetLineWidth('');
	$pdf->Cell(205,4,'','',1,'');
	
	$pdf->Line(16,$pdf->GetY()+24,200,$pdf->GetY()+24);
	$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+24);
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'33.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(35,4,'Buyer or Tenant Election ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'(Complete this section only if you are the Buyer.) The undersigned elects to have the Broker (check any that apply):','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'34.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"represent the Buyer as Buyer's Broker.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'35.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"represent the Seller as Seller's Broker.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'36.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"show Buyer properties listed with Broker's firm and Buyer agrees that Broker shall act as agent for both Buyer and Seller provided that",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'37.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"the  Seller  consents  to  limited  representation.  In  the  event  of  a  purchase,  Buyer's  and  Seller's   informed  consent  should  be",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'38.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'acknowledged in a separate writing other than the purchase contract.','',1,'');
	
	$pdf->Cell(200,1,'','',1,'');
	$pdf->Line(16,$pdf->GetY()+24,200,$pdf->GetY()+24);
	$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+24);
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'39.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(38,4,'Seller or Landlord Election ','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'(Complete this section only if you are the Seller.) The undersigned elects to have the Broker (check any that apply):','',1,'');
	
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'40.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"represent the Buyer as Buyer's Broker.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'41.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"represent the Seller as Seller's Broker.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'42.','',0,'');
	$pdf->Cell(5,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');   
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"show  Seller's  property  to  Buyers  represented  by  Broker's  firm  and  Seller  agrees  that  Broker  shall  act  as  agent  for  both  Seller  and",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'43.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,"Buyer  provided  that  Buyer consents  to  the limited representation.  In the event  of  a  purchase,  Buyer's  and Seller's  informed  consent",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'44.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'should be acknowledged in a separate writing other than the purchase contract.','',1,'');
	
	$pdf->SetFont('Arial','',7);
	$pdf->Cell(8,4,'45.','',0,'');
	$pdf->SetFont('Arial','',7);
	$pdf->Cell(23,4,'The undersigned','',0,'');
	$pdf->Cell(5,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
	$pdf->Cell(16,4,'Buyer(s) or','',0,'');
	$pdf->Cell(5,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,''); 	
	$pdf->Cell(120,4,'Seller(s) acknowledge that this document is a disclosure of duties. This document is not an employment agreement.','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(8,4,'46.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,4,'I/WE ACKNOWLEDGE RECEIPT OF A COPY OF THIS DISCLOSURE.','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(14,7,'47.','',0,'');
	$pdf->Cell(80,7,$info['print_name'],'',0,'L');
	$pdf->Cell(14,5,'','',0,'');
	$pdf->Cell(80,7,$info['print_name'],'',1,'L');
	$pdf->Cell(14,2,'','',0,'C');
	$pdf->Cell(80,2,'','T',0,'C');
	$pdf->Cell(14,2,'','',0,'C');
	$pdf->Cell(80,2,'','T',1,'C');
	$pdf->Cell(14,5,'','',0,'C');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(80,2,"^   PRINT NAME",'',0,'L');
	$pdf->Cell(14,5,'','',0,'C');
	$pdf->Cell(80,2,"^   PRINT NAME",'',1,'L');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(14,7,'48.','',0,'');
	$pdf->Cell(40,7,$info['signed_name'],'',0,'L');
	$pdf->Cell(40,7,$info['signed_date'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['signed_name'],'',0,'L');
	$pdf->Cell(40,7,$info['signed_date'],'',1,'R');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  SIGNED",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  SIGNED",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');

	$pdf->Output('','I');



?>